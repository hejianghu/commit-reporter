#!/usr/bin/env node

/**
 * Commit Reporter - Setup Script
 * 
 * Run this script once after installing to verify the installation.
 * 
 * Usage:
 *   node ~/.claude/skills/commit-reporter/scripts/setup.js
 */

const fs = require('fs');
const path = require('path');

const skillDir = path.join(__dirname, '..'); // ~/.claude/skills/commit-reporter/
const configPath = path.join(skillDir, 'config.json');

console.log('🔧 Verifying commit-reporter installation...\n');

// Check if config.json exists
if (fs.existsSync(configPath)) {
  console.log(`✅ Config file found: ${configPath}`);
  
  // Read and display current config
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`\n📋 Current configuration:`);
  console.log(`   Projects: ${config.projects?.length || 0} configured`);
  console.log(`   Default timeframe: ${config.default_timeframe || 'week'}`);
} else {
  console.log(`❌ Config file not found: ${configPath}`);
  console.log(`\n⚠️  Please make sure config.json exists in the skill directory`);
}

// Read package.json
const packagePath = path.join(skillDir, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  console.log(`\n📦 Version: ${packageJson.version}`);
}

console.log('\n✨ Setup complete!\n');
console.log('📝 Next steps:');
console.log(`   1. Edit config: ${configPath}`);
console.log('   2. Add your project paths to the "projects" array');
console.log('   3. Run: node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day\n');
console.log('📖 Documentation: https://github.com/hejianghu/commit-reporter\n');
