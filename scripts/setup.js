#!/usr/bin/env node

/**
 * Commit Reporter - Setup Script
 * 
 * Run this script after installing to set up the global configuration.
 * 
 * Usage:
 *   node scripts/setup.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get home directory
const homeDir = os.homedir();
const globalConfigDir = path.join(homeDir, '.commit-reporter');
const skillDir = path.dirname(__dirname);
const targetConfigPath = path.join(globalConfigDir, 'config.json');
const targetIndexPath = path.join(globalConfigDir, 'index.js');
const sourceIndexPath = path.join(skillDir, 'index.js');

console.log('🔧 Setting up commit-reporter...\n');

// Create global config directory
if (!fs.existsSync(globalConfigDir)) {
  fs.mkdirSync(globalConfigDir, { recursive: true });
  console.log(`✅ Created config directory: ${globalConfigDir}`);
}

// Create default config if not exists
if (!fs.existsSync(targetConfigPath)) {
  const defaultConfig = {
    projects: [],
    output_dir: path.join(globalConfigDir, 'reports'),
    default_timeframe: 'week'
  };
  
  fs.writeFileSync(targetConfigPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`✅ Created default config: ${targetConfigPath}`);
} else {
  console.log(`ℹ️  Config already exists: ${targetConfigPath}`);
}

// Copy index.js to global directory
if (fs.existsSync(sourceIndexPath)) {
  fs.copyFileSync(sourceIndexPath, targetIndexPath);
  console.log(`✅ Installed CLI to: ${targetIndexPath}`);
}

// Read package.json
const packagePath = path.join(skillDir, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  console.log(`\n📦 Version: ${packageJson.version}`);
  console.log(`📦 Dependencies: ${Object.keys(packageJson.dependencies || {}).join(', ')}`);
}

console.log('\n✨ Setup complete!\n');
console.log('📝 Next steps:');
console.log(`   1. Edit config: ${targetConfigPath}`);
console.log('   2. Add your project paths to the "projects" array');
console.log('   3. Run: node ~/.commit-reporter/index.js --timeframe day\n');
console.log('📖 Documentation: https://github.com/hejianghu/commit-reporter\n');
