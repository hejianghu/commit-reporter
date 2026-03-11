#!/usr/bin/env node

/**
 * Commit Reporter - Setup Script
 * 
 * Run this script once after installing to set up the configuration.
 * 
 * Usage:
 *   node ~/.claude/skills/commit-reporter/scripts/setup.js
 */

const fs = require('fs');
const path = require('path');

const skillDir = path.join(__dirname, '..');
const configPath = path.join(skillDir, 'config.json');

console.log('🔧 Setting up commit-reporter...\n');

// Check if config.json exists
if (fs.existsSync(configPath)) {
  console.log(`✅ Config file found: ${configPath}`);
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`\n📋 Current configuration:`);
  console.log(`   Projects: ${config.projects?.length || 0} configured`);
  console.log(`   Default timeframe: ${config.default_timeframe || 'week'}`);
} else {
  console.log(`❌ Config file not found: ${configPath}`);
}

// Read package.json
const packagePath = path.join(skillDir, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  console.log(`\n📦 Version: ${packageJson.version}`);
}

console.log('\n✨ Setup complete!\n');
console.log('📝 Configuration Guide:\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('You can configure your projects in TWO ways:\n');
console.log('  ┌─────────────────────────────────────────────────┐');
console.log('  │ Option 1: AI-Assisted Setup (Recommended)      │');
console.log('  ├─────────────────────────────────────────────────┤');
console.log('  │ Simply tell your AI assistant:                 │');
console.log('  │                                                 │');
console.log('  │ "帮我配置 commit-reporter，我要监控以下项目：" │');
console.log('  │ - 项目名称：my-project                          │');
console.log('  │   项目路径：/Users/dale/repo/my-project        │');
console.log('  │ - 项目名称：another-project                     │');
console.log('  │   项目路径：/Users/dale/repo/another-project   │');
console.log('  │                                                 │');
console.log('  │ The AI will automatically update config.json   │');
console.log('  │ for you!                                        │');
console.log('  └─────────────────────────────────────────────────┘\n');
console.log('  ┌─────────────────────────────────────────────────┐');
console.log('  │ Option 2: Manual Edit                           │');
console.log('  ├─────────────────────────────────────────────────┤');
console.log('  │ Edit config file:                               │');
console.log('  │   ' + configPath.padEnd(45) + ' │');
console.log('  │                                                 │');
console.log('  │ Example format:                                 │');
console.log('  │   {                                             │');
console.log('  │     "projects": [                               │');
console.log('  │       {                                         │');
console.log('  │         "name": "my-project",                   │');
console.log('  │         "path": "/Users/dale/repo/my-project"   │');
console.log('  │       }                                         │');
console.log('  │     ]                                           │');
console.log('  │   }                                             │');
console.log('  └─────────────────────────────────────────────────┘\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📝 Next steps:');
console.log('   1. Configure your projects (AI-assisted or manual)');
console.log('   2. Run: node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day\n');
console.log('📖 Documentation: https://github.com/hejianghu/commit-reporter\n');
