# 测试安装指南

## 问题背景

之前通过 `npx skills add hejianghu/commit-reporter -g -y` 安装时，skills CLI 只识别到 4 个 OpenSpec 相关的 skill：
- openspec-apply-change
- openspec-archive-change
- openspec-explore
- openspec-propose

**原因**: 仓库缺少名为 `commit-reporter` 的 skill 定义文件（SKILL.md）。

## 解决方案

已添加以下文件：

### 1. .claude/skills/commit-reporter/SKILL.md

这是 skill 的定义文件，包含：
- skill 名称和描述
- 使用说明
- 配置示例
- 命令行选项
- 输出格式说明

### 2. .claude/skills/commit-reporter/post-install.js

安装后自动执行的脚本：
- 创建 `~/.commit-reporter/` 目录
- 创建默认 `config.json`
- 复制 `index.js` 到全局目录

### 3. package.json 更新

添加了 `skill` 字段：
```json
{
  "skill": {
    "name": "commit-reporter",
    "entry": ".claude/skills/commit-reporter/SKILL.md",
    "postInstall": ".claude/skills/commit-reporter/post-install.js"
  }
}
```

## 测试安装

### 步骤 1: 卸载旧版本（如果有）

```bash
# 检查已安装的 skills
npx skills list

# 如果已安装 commit-reporter，先卸载
npx skills remove hejianghu/commit-reporter -g
```

### 步骤 2: 安装新版本

```bash
npx skills add hejianghu/commit-reporter -g -y
```

### 步骤 3: 验证安装

检查以下文件是否存在：

```bash
# 检查 skill 文件
ls -la ~/.commit-reporter/

# 应该看到：
# - config.json
# - index.js
```

### 步骤 4: 配置项目

编辑 `~/.commit-reporter/config.json`：

```json
{
  "projects": [
    "/Users/dale/repo/commit-reporter",
    "/Users/dale/repo/your-other-project"
  ],
  "default_timeframe": "week"
}
```

### 步骤 5: 测试运行

```bash
# 生成日报
node ~/.commit-reporter/index.js --timeframe day

# 生成周报
node ~/.commit-reporter/index.js --timeframe week

# 查看输出
cat ~/.commit-reporter/worklog.md
```

### 步骤 6: 在 Cursor 中使用

打开 Cursor，在对话中说：

```
生成我的项目日报
```

或

```
查看本周的 commit 活动
```

## 预期结果

### 安装成功标志

1. ✅ `~/.commit-reporter/` 目录创建
2. ✅ `~/.commit-reporter/config.json` 创建（含默认配置）
3. ✅ `~/.commit-reporter/index.js` 存在
4. ✅ 在 Cursor 的 skills 列表中能看到 `commit-reporter`

### 运行成功标志

1. ✅ 日报输出为单行摘要格式
2. ✅ 周报输出为详细格式（带分类）
3. ✅ 正确读取配置的 project paths
4. ✅ 正确筛选作者（使用 git config --global user.name）

## 故障排除

### 问题 1: 安装后找不到 commit-reporter skill

**检查**:
```bash
ls -la ~/.claude/skills/
```

**解决**: 确认 `.claude/skills/commit-reporter/SKILL.md` 存在

### 问题 2: 运行时报错 "No projects specified"

**原因**: config.json 中 projects 为空

**解决**: 编辑 `~/.commit-reporter/config.json`，添加你的项目路径

### 问题 3: 输出为 "No commits in this period"

**可能原因**:
1. 项目路径不正确
2. 时间范围内没有 commits
3. 作者筛选不匹配

**解决**:
```bash
# 检查路径
ls -la /your/project/path/.git

# 检查时间范围
node ~/.commit-reporter/index.js --timeframe month

# 检查作者
git config --global user.name

# 不筛选作者运行
node ~/.commit-reporter/index.js -a ""
```

## 验证清单

- [ ] 能通过 `npx skills add hejianghu/commit-reporter -g -y` 安装
- [ ] 安装后自动创建 `~/.commit-reporter/` 目录
- [ ] config.json 包含正确的默认配置
- [ ] index.js 能正常运行
- [ ] 日报格式为单行摘要
- [ ] 周报格式为详细分类
- [ ] 在 Cursor 中能识别并使用该 skill

## 更新日志

**2026-03-11**: 
- 添加 `.claude/skills/commit-reporter/SKILL.md`
- 添加 `post-install.js` 自动配置脚本
- 更新 `package.json` 添加 skill 元数据
- 更新 `README.md` 添加安装说明
