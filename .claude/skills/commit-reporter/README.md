# Commit Reporter

从本地 Git 仓库生成日报、周报、月报、年度报告的自动化工具。

## 功能特性

- 🔍 **多项目检索**: 支持同时追踪多个本地 Git 仓库
- 📅 **灵活时间范围**: 支持天、周、月、年维度
- 📊 **智能报告生成**: 自动汇总 commit 信息，生成结构化报告
- 🎯 **自定义筛选**: 按作者筛选（默认使用 Git 全局配置的用户）
- 📤 **多格式输出**: Markdown、JSON、纯文本
- 📝 **日报精简模式**: 日报采用单行摘要格式，周报/月报/年报采用详细格式
- 💻 **跨平台支持**: 支持 Windows 和 macOS 绝对路径配置
- 🔒 **无需 GitHub Token**: 仅读取本地 Git 仓库，无需联网
- 🤖 **Cursor Skill**: 支持通过 `npx skills add` 安装到 Cursor

## 安装方式

### 作为 Cursor Skill 安装（推荐）

```bash
# Install
npx skills add hejianghu/commit-reporter -g -y

# Setup (one-time)
node ~/.claude/skills/commit-reporter/scripts/setup.js
```

安装后会：
- 创建全局配置目录 `~/.commit-reporter/`
- 创建默认配置文件 `~/.commit-reporter/config.json`
- 所有文件都在 `~/.claude/skills/commit-reporter/` 目录

## 快速开始

### 1. 配置项目列表

编辑 `~/.commit-reporter/config.json`：

```json
{
  "projects": [
    "/Users/dale/repo/commit-reporter",
    "/Users/dale/repo/my-project"
  ],
  "default_timeframe": "week"
}
```

### 2. 生成报告

```bash
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day
```

### 3. 在 Cursor 中使用

安装 skill 后，直接在 Cursor 对话中说：

```
生成我的项目日报
```

或

```
查看本周的 commit 活动
```

## 命令行选项

```
Usage: node scripts/index.js [options]

Options:
  -p, --projects <paths>   本地仓库路径列表（逗号分隔），覆盖 config.json 配置
  -t, --timeframe <type>   时间范围：day|week|month|year (默认：week)
  --since <date>           开始日期 (YYYY-MM-DD)
  --until <date>           结束日期 (YYYY-MM-DD)
  -a, --author <name>      按作者筛选（可选，缺省则使用 git config --global user.name）
  -o, --output <file>      输出文件路径（可选，缺省则输出到 ./worklog.md）
  -f, --format <type>      输出格式：markdown|json|text (默认：markdown)
  -h, --help               显示帮助
```

## 报告示例

### 日报（精简格式）

```
commit-reporter：feat: 新增登录功能，fix: 修复样式问题，docs: 更新 README
my-project：refactor: 优化数据库查询，test: 添加单元测试
```

### 周报/月报/年报（详细格式）

```markdown
# Commit Report

**Period**: 2026-03-04 to 2026-03-11 (week)
**Generated**: 2026-03-11 01:20:00

---

## 📦 commit-reporter

**Total Commits**: 5

### 🚀 Features

- `8783273` feat: add OpenSpec structure *(@hejianghu)*

### 🐛 Bug Fixes

- `5976259` fix: initial commit *(@hejianghu)*

### 👥 Contributors (1)

- hejianghu

---

## 📊 Summary

**Total Projects**: 2
**Total Commits**: 10
```

## 配置详解

### config.json 完整示例

```json
{
  "projects": [
    "/Users/dale/repo/commit-reporter",
    "/Users/dale/repo/my-project"
  ],
  "output_dir": "/Users/dale/repo/commit-reporter/reports",
  "default_timeframe": "week"
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `projects` | Array\<string\> 或 Array\<object\> | ✅ | 要追踪的本地仓库路径列表 |
| `output_dir` | string | ❌ | 输出目录（绝对路径，支持 Windows/Mac） |
| `default_timeframe` | string | ❌ | 默认时间范围：day/week/month/year |

### projects 字段双格式支持

**简单数组**（适合快速配置）:
```json
"projects": ["/Users/dale/repo/project1", "/Users/dale/repo/project2"]
```
报告中直接使用路径最后一级作为项目名称。

**对象数组**（适合自定义名称）:
```json
"projects": [
  {"name": "项目 A", "path": "/Users/dale/repo/project1"},
  {"name": "项目 B", "path": "/Users/dale/repo/project2"}
]
```
报告中使用 `name` 字段显示，更友好。

### 跨平台路径配置

**macOS 用户**:
```json
{
  "projects": ["/Users/dale/repo/commit-reporter"]
}
```

**Windows 用户**:
```json
{
  "projects": ["C:\\Users\\dale\\repo\\commit-reporter"]
}
```

> 💡 **提示**: 
> - 使用绝对路径，避免相对路径受工作目录影响
> - Windows 路径使用双反斜杠 `\\` 或正斜杠 `/`
> - macOS/Linux 路径使用正斜杠 `/`

## 使用示例

```bash
# 日报（精简格式）
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day

# 周报（详细格式）
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe week

# 月报（详细格式）
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe month

# 年报（详细格式）
node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe year

# 自定义时间范围
node ~/.claude/skills/commit-reporter/scripts/index.js --since "2026-03-01" --until "2026-03-10"

# 输出到默认文件 (./worklog.md)
node ~/.claude/skills/commit-reporter/scripts/index.js

# 输出到指定文件
node ~/.claude/skills/commit-reporter/scripts/index.js -o ./reports/my-report.md

# 输出到终端
node ~/.claude/skills/commit-reporter/scripts/index.js -f text -o -

# 指定项目路径
node ~/.claude/skills/commit-reporter/scripts/index.js -p "/Users/dale/repo/commit-reporter,/Users/dale/repo/my-project"

# 按作者筛选
node ~/.claude/skills/commit-reporter/scripts/index.js -a "hejianghu"
```

## 输出文件

### 默认输出

- **文件**: `scripts/worklog.md`（skill 目录的 scripts 子目录）
- **格式**: Markdown
- **自动创建**: 文件不存在时自动创建

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

### Q: 是否支持远程 GitHub 仓库？

当前版本仅支持本地 Git 仓库。如需分析远程仓库，请先 `git clone` 或 `git fetch` 到本地。

### Q: 路径中包含中文可以吗？

建议使用英文路径，避免潜在的编码问题。如必须使用中文路径，请确保系统编码正确。

### Q: 如何在 Cursor 中使用？

1. 安装 skill: `npx skills add hejianghu/commit-reporter -g -y`
2. 运行 setup: `node ~/.claude/skills/commit-reporter/scripts/setup.js`
3. 配置项目：编辑 `~/.commit-reporter/config.json`
4. 在 Cursor 对话中直接说："生成我的项目日报"
5. 或手动运行：`node ~/.claude/skills/commit-reporter/scripts/index.js --timeframe day`

### Q: 如何开发这个 skill？

```bash
# Clone 仓库
git clone https://github.com/hejianghu/commit-reporter.git
cd commit-reporter/.claude/skills/commit-reporter

# 安装依赖
npm install

# 运行测试
npm run daily    # 生成日报
npm run weekly   # 生成周报
```

## 系统要求

- **Node.js**: >= 18.0.0
- **Git**: >= 2.0.0（系统已安装 git 命令行工具）
- **操作系统**: macOS / Windows / Linux



## 许可证

MIT

## 仓库

https://github.com/hejianghu/commit-reporter
