#!/usr/bin/env node

/**
 * Commit Reporter - Git Commit Log Report Generator
 * 
 * Generate daily/weekly/monthly/yearly reports from local Git repositories.
 * 
 * Usage:
 *   node ~/.claude/skills/commit-reporter/index.js --timeframe day
 */

const { program } = require('commander');
const { execSync } = require('child_process');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

// Load configuration (from same directory as this script)
const configPath = path.join(__dirname, 'config.json');
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

program
  .name('commit-reporter')
  .description('Generate reports from local Git repository commit logs')
  .version('1.0.0')
  .option('-p, --projects <paths>', 'local repository paths (comma-separated)')
  .option('-t, --timeframe <type>', 'timeframe: day|week|month|year', 'week')
  .option('--since <date>', 'start date (YYYY-MM-DD)')
  .option('--until <date>', 'end date (YYYY-MM-DD)')
  .option('-a, --author <name>', 'filter by author (default: git config --global user.name)')
  .option('-o, --output <file>', 'output file path (default: ./worklog.md)')
  .option('-f, --format <type>', 'output format: markdown|json|text', 'markdown')
  .parse(process.argv);

const options = program.opts();

// Get projects
const projects = options.projects 
  ? options.projects.split(',').map(p => p.trim())
  : (config.projects || []);

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

// Get default author from git config
function getDefaultAuthor() {
  try {
    const author = execSync('git config --global user.name', { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return author || null;
  } catch (error) {
    return null;
  }
}

// Get commits from local Git repository
function getGitLog(repoPath, since, until, author) {
  const resolvedPath = path.resolve(repoPath);
  
  // Check if path exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`⚠️  Path does not exist: ${resolvedPath}`);
    return [];
  }
  
  // Check if it's a git repository
  const gitDir = path.join(resolvedPath, '.git');
  if (!fs.existsSync(gitDir)) {
    console.error(`⚠️  Not a git repository: ${resolvedPath}`);
    return [];
  }
  
  // Build git log command
  let cmd = `git -C "${resolvedPath}" log --since="${since}" --until="${until}T23:59:59" --format="%H|%an|%ae|%s" --no-merges`;
  
  if (author) {
    cmd += ` --author="${author}"`;
  }
  
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    if (!output.trim()) {
      return [];
    }
    
    const commits = output.trim().split('\n').map(line => {
      const [hash, authorName, authorEmail, message] = line.split('|');
      return {
        hash: hash.substring(0, 7),
        author: authorName,
        email: authorEmail,
        message: message.trim()
      };
    });
    
    return commits;
  } catch (error) {
    console.error(`⚠️  Error fetching git log from ${resolvedPath}: ${error.message}`);
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
    const message = commit.message.toLowerCase();
    const type = message.split(':')[0].trim();
    
    if (groups[type]) {
      groups[type].push(commit);
    } else {
      groups.other.push(commit);
    }
  });
  
  return groups;
}

// Get project name from path or config
function getProjectName(project) {
  if (typeof project === 'object' && project.name) {
    return project.name;
  }
  
  // Extract from path
  const projectPath = typeof project === 'object' ? project.path : project;
  return path.basename(projectPath);
}

// Get project path
function getProjectPath(project) {
  return typeof project === 'object' ? project.path : project;
}

// Generate simplified daily report
function generateDailyReport(projectCommits) {
  let report = '';
  
  Object.keys(projectCommits).forEach((projectName, index) => {
    const commits = projectCommits[projectName];
    
    if (commits.length === 0) {
      return;
    }
    
    if (index > 0) {
      report += '\n';
    }
    
    // Format: 项目 A：任务 1，任务 2，任务 3
    const messages = commits.map(c => c.message).join(',');
    report += `${projectName}:${messages}`;
  });
  
  return report || 'No commits in this period';
}

// Generate detailed report (weekly/monthly/yearly)
function generateDetailedReport(projectCommits, dateRange, timeframe) {
  const { since, until } = dateRange;
  
  let report = `# Commit Report\n\n`;
  report += `**Period**: ${since} to ${until} (${timeframe})\n`;
  report += `**Generated**: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n`;
  report += `---\n\n`;
  
  let totalCommits = 0;
  
  Object.keys(projectCommits).forEach(projectName => {
    const commits = projectCommits[projectName];
    totalCommits += commits.length;
    
    report += `## 📦 ${projectName}\n\n`;
    
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
          report += `- \`${commit.hash}\` ${commit.message} *(@${commit.author})*\n`;
        });
        report += `\n`;
      }
    });
    
    // Contributors
    const contributors = [...new Set(commits.map(c => c.author))];
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

// Generate Markdown report
function generateMarkdownReport(projectCommits, dateRange, timeframe) {
  if (timeframe === 'day') {
    return generateDailyReport(projectCommits);
  } else {
    return generateDetailedReport(projectCommits, dateRange, timeframe);
  }
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
  
  Object.keys(projectCommits).forEach(projectName => {
    const commits = projectCommits[projectName];
    report += `${projectName} (${commits.length} commits)\n`;
    report += '-'.repeat(40) + '\n';
    
    commits.forEach(commit => {
      report += `  [${commit.hash}] ${commit.message} - ${commit.author}\n`;
    });
    report += '\n';
  });
  
  return report;
}

// Main function
async function main() {
  console.log('🔍 Commit Reporter v1.0.0\n');
  console.log(`📅 Timeframe: ${options.timeframe}`);
  console.log(`📦 Projects: ${projects.length}`);
  console.log('');
  
  const dateRange = getDateRange(options.timeframe);
  console.log(`📆 Date Range: ${dateRange.since} to ${dateRange.until}\n`);
  
  // Get default author if not specified
  const author = options.author || getDefaultAuthor();
  if (author) {
    console.log(`👤 Author filter: ${author}`);
  } else {
    console.log(`👤 Author filter: (all authors)`);
  }
  console.log('');
  
  // Fetch commits for all projects
  const projectCommits = {};
  
  for (const project of projects) {
    const projectName = getProjectName(project);
    const projectPath = getProjectPath(project);
    
    console.log(`⏳ Fetching ${projectName}...`);
    const commits = getGitLog(projectPath, dateRange.since, dateRange.until, author);
    projectCommits[projectName] = commits;
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
  const outputPath = options.output || path.join(__dirname, 'worklog.md');
  
  if (outputPath === '-') {
    // Output to stdout
    console.log('\n--- REPORT START ---\n');
    console.log(report);
    console.log('\n--- REPORT END ---');
  } else {
    // Write to file
    const resolvedOutput = path.resolve(outputPath);
    fs.writeFileSync(resolvedOutput, report);
    console.log(`✅ Report saved to: ${resolvedOutput}`);
  }
}

// Run
main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
