# Commit Reporter

从 GitHub 项目生成日报、周报、月报、年度报告的自动化工具。

## 功能特性

- 🔍 **多项目检索**: 支持同时追踪多个 GitHub 项目
- 📅 **灵活时间范围**: 支持天、周、月、年维度
- 📊 **智能报告生成**: 自动汇总 commit 信息，生成结构化报告
- 🎯 **自定义筛选**: 按作者筛选（默认使用 Git 全局配置的用户）
- 📤 **多格式输出**: Markdown、JSON、纯文本
- 📝 **日报精简模式**: 日报采用单行摘要格式，周报/月报/年报采用详细格式
- 💻 **跨平台支持**: 支持 Windows 和 macOS 绝对路径配置

## 快速开始

### 安装依赖

```bash
npm install
```

> ⚠️ **注意**: 本项目基于 Node.js，**仅支持 npm 安装**，不使用 pip。

### 配置项目列表

编辑 `config.json` 添加要追踪的项目：

#### 方式 1: 简单数组格式

```json
{
  "projects": [
    "hejianghu/commit-reporter",
    "openclaw/openclaw"
  ],
  "output_dir": "/Users/dale/repo/commit-reporter/reports",
  "default_timeframe": "week"
}
```

#### 方式 2: 对象数组格式（支持自定义项目名称）

```json
{
  "projects": [
    {"name": "Commit Reporter", "path": "hejianghu/commit-reporter"},
    {"name": "OpenClaw", "path": "openclaw/openclaw"}
  ],
  "output_dir": "/Users/dale/repo/commit-reporter/reports",
  "default_timeframe": "week"
}
```

### 跨平台路径配置说明

**macOS 用户**:
```json
{
  "output_dir": "/Users/dale/repo/commit-reporter/reports"
}
```

**Windows 用户**:
```json
{
  "output_dir": "C:\\Users\\dale\\repo\\commit-reporter\\reports"
}
```

> 💡 **提示**: 
> - 使用绝对路径，避免相对路径受工作目录影响
> - Windows 路径使用双反斜杠 `\\` 或正斜杠 `/`
> - macOS/Linux 路径使用正斜杠 `/`

### 生成报告

```bash
# 日报（精简格式）
node index.js --timeframe day

# 周报（详细格式）
node index.js --timeframe week

# 月报（详细格式）
node index.js --timeframe month

# 年报（详细格式）
node index.js --timeframe year

# 自定义时间范围
node index.js --since "2026-03-01" --until "2026-03-10"

# 输出到默认文件 (./worklog.md)
node index.js

# 输出到指定文件
node index.js -o ./reports/my-report.md

# 输出到终端
node index.js -f text
```

## 命令行选项

```
Usage: node index.js [options]

Options:
  -p, --projects <list>    项目列表（逗号分隔），覆盖 config.json 配置
  -t, --timeframe <type>   时间范围：day|week|month|year (默认：week)
  --since <date>           开始日期 (YYYY-MM-DD)
  --until <date>           结束日期 (YYYY-MM-DD)
  -a, --author <name>      按作者筛选（可选，缺省则使用 git config --global user.name）
  -o, --output <file>      输出文件路径（可选，缺省则输出到 ./worklog.md）
  -f, --format <type>      输出格式：markdown|json|text (默认：markdown)
  --token <token>          GitHub Token（可选，覆盖 config.json 和环境变量）
  -h, --help               显示帮助
```

## 报告示例

### 日报（精简格式）

```
项目 A：feat: 新增登录功能，fix: 修复样式问题，docs: 更新 README
项目 B：refactor: 优化数据库查询，test: 添加单元测试
```

### 周报/月报/年报（详细格式）

```markdown
# Commit Report

**Period**: 2026-03-03 to 2026-03-10 (week)
**Generated**: 2026-03-11 01:20:00

---

## 📦 hejianghu/commit-reporter

**Total Commits**: 5

### 🚀 Features

- `8783273` feat: add OpenSpec structure *(@dale, 03-11)*

### 🐛 Bug Fixes

- `5976259` fix: initial commit *(@dale, 03-10)*

### 👥 Contributors (1)

- dale

---

## 📊 Summary

**Total Projects**: 2
**Total Commits**: 10
```

## 配置文件详解

### config.json 完整示例

```json
{
  "projects": [
    "hejianghu/commit-reporter",
    "openclaw/openclaw"
  ],
  "output_dir": "/Users/dale/repo/commit-reporter/reports",
  "default_timeframe": "week",
  "github_token": "gho_xxxxxxxxxxxxxxxxxxxx"
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `projects` | Array\<string\> 或 Array\<object\> | ✅ | 要追踪的项目列表 |
| `output_dir` | string | ❌ | 输出目录（绝对路径，支持 Windows/Mac） |
| `default_timeframe` | string | ❌ | 默认时间范围：day/week/month/year |
| `github_token` | string | ❌ | GitHub API Token（提高速率限制） |

### projects 字段双格式支持

**简单数组**（适合快速配置）:
```json
"projects": ["owner/repo1", "owner/repo2"]
```
报告中直接使用仓库全名显示。

**对象数组**（适合自定义名称）:
```json
"projects": [
  {"name": "项目 A", "path": "owner/repo1"},
  {"name": "项目 B", "path": "owner/repo2"}
]
```
报告中使用 `name` 字段显示，更友好。

## 输出文件

### 默认输出

- **文件**: `./worklog.md`（项目根目录）
- **格式**: Markdown
- **自动创建**: 文件不存在时自动创建

### .gitignore 配置

`worklog.md` 已纳入 `.gitignore`，不会被提交：

```gitignore
# 依赖
node_modules/
npm-debug.log*

# 日志
logs/
*.log

# 报告输出
worklog.md
reports/
*.report.md

# 配置文件（敏感）
config.local.json
*.secret.json

# macOS
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo

# 临时文件
tmp/
temp/
*.tmp
```

## 环境变量

可以通过环境变量配置（优先级低于命令行参数，高于 config.json）:

```bash
# GitHub Token
export GITHUB_TOKEN=gho_xxxxxxxxxxxxxxxxxxxx

# 使用
node index.js
```

## 常见问题

### Q: 如何查看我的 Git 全局配置作者？

```bash
git config --global user.name
```

### Q: 如何修改 Git 全局配置作者？

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Q: 为什么日报和周报格式不同？

- **日报**: 精简格式，适合每日站会快速浏览
- **周报/月报/年报**: 详细格式，包含分类统计和详细信息，适合周期性回顾

### Q: 如何获取 GitHub Token？

访问 https://github.com/settings/tokens 创建 Personal Access Token，建议添加 `repo` 和 `read:org` 权限。

## 许可证

MIT
