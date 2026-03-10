#!/usr/bin/env node

/**
 * Commit Reporter - GitHub Commit Log Report Generator
 * 
 * Usage:
 *   node index.js --timeframe day
 *   node index.js --timeframe week
 *   node index.js --timeframe month
 *   node index.js --since "2026-03-01" --until "2026-03-10"
 */

const { program } = require('commander');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, 'config.json');
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

program
  .name('commit-reporter')
  .description('Generate reports from GitHub commit logs')
  .version('1.0.0')
  .option('-p, --projects <list>', 'projects to track (comma-separated)')
  .option('-t, --timeframe <type>', 'timeframe: day|week|month|year', 'week')
  .option('--since <date>', 'start date (YYYY-MM-DD)')
  .option('--until <date>', 'end date (YYYY-MM-DD)')
  .option('-a, --author <name>', 'filter by author')
  .option('-o, --output <file>', 'output file path')
  .option('-f, --format <type>', 'output format: markdown|json|text', 'markdown')
  .option('--token <token>', 'GitHub token (overrides config)')
  .parse(process.argv);

const options = program.opts();

// Get GitHub token
const githubToken = options.token || config.github_token || process.env.GITHUB_TOKEN;

// Get projects
const projects = options.projects 
  ? options.projects.split(',').map(p => p.trim())
  : config.projects || [];

if (projects.length === 0) {
  console.error('❌ No projects specified. Use -p or add to config.json');
  process.exit(1);
}

// Calculate date range
function getDateRange(timeframe) {
  const now = dayjs();
  let since, until = now;
  
  switch (timeframe) {
    case 'day':
      since = now.subtract(1, 'day');
      break;
    case 'week':
      since = now.subtract(7, 'days');
      break;
    case 'month':
      since = now.subtract(1, 'month');
      break;
    case 'year':
      since = now.subtract(1, 'year');
      break;
    default:
      since = now.subtract(7, 'days');
  }
  
  return {
    since: options.since || since.format('YYYY-MM-DD'),
    until: options.until || until.format('YYYY-MM-DD')
  };
}

// Fetch commits from GitHub API
async function fetchCommits(repo, since, until, author) {
  const [owner, repoName] = repo.split('/');
  let url = `https://api.github.com/repos/${owner}/${repoName}/commits?since=${since}T00:00:00Z&until=${until}T23:59:59Z&per_page=100`;
  
  if (author) {
    url += `&author=${author}`;
  }
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }
  
  try {
    const response = await fetch(url, { headers });
    
    if (response.status === 403) {
      console.error(`⚠️  Rate limit exceeded for ${repo}`);
      return [];
    }
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch ${repo}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const commits = await response.json();
    return commits;
  } catch (error) {
    console.error(`❌ Error fetching ${repo}: ${error.message}`);
    return [];
  }
}

// Group commits by type
function groupCommitsByType(commits) {
  const groups = {
    feat: [],
    fix: [],
    docs: [],
    style: [],
    refactor: [],
    test: [],
    chore: [],
    other: []
  };
  
  commits.forEach(commit => {
    const message = commit.commit.message.toLowerCase();
    const type = message.split(':')[0].trim();
    
    if (groups[type]) {
      groups[type].push(commit);
    } else {
      groups.other.push(commit);
    }
  });
  
  return groups;
}

// Generate Markdown report
function generateMarkdownReport(projectCommits, dateRange, timeframe) {
  const { since, until } = dateRange;
  
  let report = `# Commit Report\n\n`;
  report += `**Period**: ${since} to ${until} (${timeframe})\n`;
  report += `**Generated**: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n`;
  report += `---\n\n`;
  
  let totalCommits = 0;
  
  Object.keys(projectCommits).forEach(repo => {
    const commits = projectCommits[repo];
    totalCommits += commits.length;
    
    report += `## 📦 ${repo}\n\n`;
    
    if (commits.length === 0) {
      report += `*No commits in this period*\n\n`;
      return;
    }
    
    report += `**Total Commits**: ${commits.length}\n\n`;
    
    // Group by type
    const grouped = groupCommitsByType(commits);
    
    // Display by category
    const typeLabels = {
      feat: '🚀 Features',
      fix: '🐛 Bug Fixes',
      docs: '📚 Documentation',
      style: '💅 Style',
      refactor: '♻️ Refactoring',
      test: '✅ Tests',
      chore: '🔧 Chores',
      other: '📝 Other'
    };
    
    Object.keys(typeLabels).forEach(type => {
      if (grouped[type].length > 0) {
        report += `### ${typeLabels[type]}\n\n`;
        grouped[type].forEach(commit => {
          const message = commit.commit.message.split('\n')[0];
          const author = commit.commit.author.name;
          const date = dayjs(commit.commit.author.date).format('MM-DD');
          const sha = commit.sha.substring(0, 7);
          
          report += `- \`${sha}\` ${message} *(@${author}, ${date})*\n`;
        });
        report += `\n`;
      }
    });
    
    // Contributors
    const contributors = [...new Set(commits.map(c => c.commit.author.name))];
    report += `### 👥 Contributors (${contributors.length})\n\n`;
    report += contributors.map(c => `- ${c}`).join('\n') + '\n\n';
    
    report += `---\n\n`;
  });
  
  // Summary
  report += `## 📊 Summary\n\n`;
  report += `**Total Projects**: ${Object.keys(projectCommits).length}\n`;
  report += `**Total Commits**: ${totalCommits}\n`;
  
  return report;
}

// Generate JSON report
function generateJsonReport(projectCommits, dateRange, timeframe) {
  return JSON.stringify({
    metadata: {
      generated: dayjs().toISOString(),
      timeframe,
      dateRange
    },
    projects: projectCommits,
    summary: {
      totalProjects: Object.keys(projectCommits).length,
      totalCommits: Object.values(projectCommits).reduce((sum, commits) => sum + commits.length, 0)
    }
  }, null, 2);
}

// Generate text report
function generateTextReport(projectCommits, dateRange, timeframe) {
  const { since, until } = dateRange;
  
  let report = `COMMIT REPORT\n`;
  report += `Period: ${since} to ${until} (${timeframe})\n`;
  report += `Generated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n`;
  report += '='.repeat(60) + '\n\n';
  
  Object.keys(projectCommits).forEach(repo => {
    const commits = projectCommits[repo];
    report += `${repo} (${commits.length} commits)\n`;
    report += '-'.repeat(40) + '\n';
    
    commits.forEach(commit => {
      const message = commit.commit.message.split('\n')[0];
      const author = commit.commit.author.name;
      const sha = commit.sha.substring(0, 7);
      report += `  [${sha}] ${message} - ${author}\n`;
    });
    report += '\n';
  });
  
  return report;
}

// Main function
async function main() {
  console.log('🔍 Commit Reporter v1.0.0\n');
  console.log(`📅 Timeframe: ${options.timeframe}`);
  console.log(`📦 Projects: ${projects.join(', ')}`);
  console.log('');
  
  const dateRange = getDateRange(options.timeframe);
  console.log(`📆 Date Range: ${dateRange.since} to ${dateRange.until}\n`);
  
  // Fetch commits for all projects
  const projectCommits = {};
  
  for (const repo of projects) {
    console.log(`⏳ Fetching ${repo}...`);
    const commits = await fetchCommits(repo, dateRange.since, dateRange.until, options.author);
    projectCommits[repo] = commits;
    console.log(`   ✓ ${commits.length} commits\n`);
  }
  
  // Generate report
  let report;
  const format = options.format || 'markdown';
  
  switch (format) {
    case 'json':
      report = generateJsonReport(projectCommits, dateRange, options.timeframe);
      break;
    case 'text':
      report = generateTextReport(projectCommits, dateRange, options.timeframe);
      break;
    default:
      report = generateMarkdownReport(projectCommits, dateRange, options.timeframe);
  }
  
  // Output
  if (options.output) {
    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, report);
    console.log(`✅ Report saved to: ${outputPath}`);
  } else {
    console.log('--- REPORT START ---\n');
    console.log(report);
    console.log('--- REPORT END ---');
  }
}

// Run
main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
