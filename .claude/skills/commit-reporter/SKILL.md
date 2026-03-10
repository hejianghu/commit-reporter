---
name: commit-reporter
description: Generate daily/weekly/monthly/yearly reports from local Git repository commit logs. Use when user asks for commit report, daily report, weekly report, worklog, or Git activity summary.
---

# Commit Reporter Skill

Generate structured reports from local Git repository commit logs.

## Quick Start

```bash
# Install globally
npx skills add hejianghu/commit-reporter -g -y

# Run setup script (one-time)
node ~/.claude/skills/commit-reporter/scripts/setup.js

# Usage in Cursor
# Just ask: "Generate a daily report for my projects"

# Or run directly
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day
```

## What It Does

- 📊 Generate daily/weekly/monthly/yearly reports from local Git repositories
- 📝 Daily report: simplified single-line summary format
- 📋 Weekly/Monthly/Yearly: detailed format with Conventional Commits categorization
- 🎯 Auto-filter by author (uses `git config --global user.name`)
- 💻 Support multiple projects tracking
- 🔒 No GitHub API or token required (local git log only)

## Installation & Configuration

### Step 1: Install

```bash
npx skills add hejianghu/commit-reporter -g -y
```

### Step 2: Run Setup (Verification)

```bash
node ~/.claude/skills/commit-reporter/scripts/setup.js
```

This will:
- Verify installation
- Check config.json exists
- Display current configuration

### Step 3: Configure

Edit `~/.claude/skills/commit-reporter/config.json`:

```json
{
  "projects": [
    "/Users/dale/repo/commit-reporter",
    "/Users/dale/repo/my-project"
  ],
  "default_timeframe": "week"
}
```

### projects Field - Dual Format Support

**Simple Array**:
```json
"projects": ["/Users/dale/repo/project1", "/Users/dale/repo/project2"]
```

**Object Array** (with custom names):
```json
"projects": [
  {"name": "Project A", "path": "/Users/dale/repo/project1"},
  {"name": "Project B", "path": "/Users/dale/repo/project2"}
]
```

### Cross-Platform Path Examples

**macOS**:
```json
{
  "projects": ["/Users/dale/repo/commit-reporter"]
}
```

**Windows**:
```json
{
  "projects": ["C:\\Users\\dale\\repo\\commit-reporter"]
}
```

## Usage

### Daily Report (Simplified Format)

```bash
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day
```

Output:
```
commit-reporter: feat: add new feature, fix: bug fix, docs: update README
```

### Weekly Report (Detailed Format)

```bash
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe week
```

Output:
```markdown
# Commit Report

**Period**: 2026-03-04 to 2026-03-11 (week)

## 📦 commit-reporter

**Total Commits**: 4

### 🚀 Features
- `8783273` feat: add OpenSpec structure *(@hejianghu)*

### 🐛 Bug Fixes
...
```

### Command Line Options

```
Usage: node scripts/index.js [options]

Options:
  -p, --projects <paths>   Local repository paths (comma-separated, optional)
  -t, --timeframe <type>   Timeframe: day|week|month|year (default: week)
  --since <date>           Start date (YYYY-MM-DD)
  --until <date>           End date (YYYY-MM-DD)
  -a, --author <name>      Filter by author (default: git config --global user.name)
  -o, --output <file>      Output file path (optional, default: stdout)
  -f, --format <type>      Output format: markdown|json|text (default: markdown)
  --no-progress            Disable progress output (for machine parsing)
  -h, --help               Show help
```

### Examples

```bash
# Daily report (output to stdout by default)
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day

# Weekly report to specific file
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe week -o ./weekly-report.md

# Custom date range
node ~/.claude/skills/commit-reporter/scripts/index.js --since "2026-03-01" --until "2026-03-10"

# Multiple projects (overrides config.json)
node ~/.claude/skills/commit-reporter/scripts/index.js -p "/path/to/repo1,/path/to/repo2"

# Use projects from config.json (default)
node ~/.claude/skills/commit-reporter/scripts/index.js

# JSON output (optimized for LLM parsing)
node ~/.claude/skills/commit-reporter/scripts/index.js -f json --no-progress

# Output to stdout (default behavior)
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day
```

## Output Formats

### Markdown (default)
- Daily: simplified single-line format
- Weekly/Monthly/Yearly: detailed format with categories
- Human-readable with emoji and formatting

### JSON (LLM-optimized)
- Flattened commit list for easy parsing
- Summary statistics by type
- Metadata for context
- Ideal for AI agents to process

### Text
Plain text format for terminal viewing.

## Output Destination

- **Default**: stdout (standard output)
- **With `-o`**: Write to specified file
- **Progress messages**: Only shown when not using `--no-progress`

## Default Behavior

- **Output**: `./worklog.md` (in skill directory)
- **Author**: Auto-detect from `git config --global user.name`
- **Timeframe**: `week` (if not specified)

## File Structure

```
~/.claude/skills/commit-reporter/
├── SKILL.md          # Skill documentation
├── README.md         # Complete documentation
├── package.json      # Dependencies
├── config.json       # Configuration (edit this file!)
├── .gitignore
└── scripts/
    ├── index.js      # Main CLI program
    └── setup.js      # Verification script
```

## System Requirements

- Node.js >= 18.0.0
- Git >= 2.0.0
- macOS / Windows / Linux

## Troubleshooting

### No commits showing
- Check if the path is correct
- Verify it's a git repository (has `.git` folder)
- Check the date range

### Author filter not working
- Run `git config --global user.name` to check
- Use `-a` parameter to specify author explicitly

### Path not found
- Use absolute paths
- Check path format for your OS (Windows uses `\\`)

## License

MIT

## Documentation

See `README.md` in this directory for complete documentation.

## Repository

https://github.com/hejianghu/commit-reporter
