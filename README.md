# Commit Reporter

从 GitHub 项目生成日报、周报、月报、年度报告的自动化工具。

## 功能特性

- 🔍 **多项目检索**: 支持同时追踪多个 GitHub 项目
- 📅 **灵活时间范围**: 支持天、周、月、年维度
- 📊 **智能报告生成**: 自动汇总 commit 信息，生成结构化报告
- 🎯 **自定义筛选**: 按作者、文件类型、关键词过滤
- 📤 **多格式输出**: Markdown、JSON、纯文本

## 快速开始

### 安装依赖

```bash
npm install
# 或
pip install -r requirements.txt
```

### 配置项目列表

编辑 `config.json` 添加要追踪的项目：

```json
{
  "projects": [
    "hejianghu/commit-reporter",
    "openclaw/openclaw"
  ],
  "output_dir": "./reports",
  "default_timeframe": "week"
}
```

### 生成报告

```bash
# 日报
node index.js --timeframe day

# 周报
node index.js --timeframe week

# 月报
node index.js --timeframe month

# 自定义时间范围
node index.js --since "2026-03-01" --until "2026-03-10"
```

## 命令行选项

```
Usage: node index.js [options]

Options:
  -p, --projects <list>    项目列表（逗号分隔）
  -t, --timeframe <type>   时间范围：day|week|month|year (默认：week)
  --since <date>           开始日期 (YYYY-MM-DD)
  --until <date>           结束日期 (YYYY-MM-DD)
  -a, --author <name>      按作者筛选
  -o, --output <file>      输出文件路径
  -f, --format <type>      输出格式：markdown|json|text (默认：markdown)
  -h, --help               显示帮助
```

## 报告示例

### 日报结构

```markdown
# 项目日报 - 2026-03-10

## 项目 A
- **Commits**: 5
- **Contributors**: 2
- **主要变更**:
  - feat: 新增用户登录功能
  - fix: 修复登录页面样式问题

## 项目 B
...
```

## 许可证

MIT
