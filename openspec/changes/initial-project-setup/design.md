## Context

GitHub 开发者需要定期追踪本地仓库进展，手动汇总 commit 信息耗时且容易遗漏。现有解决方案要么过于复杂（如完整的 CI/CD 平台），要么功能单一（仅显示 commit 列表）。本项目通过轻量级 CLI 工具，直接读取本地 Git 仓库的 commit log，提供灵活的报告生成功能。

**技术约束**:
- 使用 Node.js 运行时（用户已安装 Node.js 24.14.0）
- 依赖本地 Git 命令行工具（`git log`）
- 无需数据库，纯文件操作
- 支持 macOS/Linux/Windows 跨平台
- 无需 GitHub API 或 Token（仅本地仓库）

**利益相关者**:
- 主要用户：独立开发者、小团队 Tech Lead
- 使用场景：每日站会、周报汇总、月度回顾

## Goals / Non-Goals

**Goals:**
- 提供简单易用的 CLI 界面，5 分钟内上手
- 支持多项目同时追踪，减少重复操作
- 生成结构化报告，按 Conventional Commits 分类
- **日报采用精简格式**（单行摘要），**周报/月报/年报采用详细格式**
- 支持多种输出格式（Markdown 用于分享，JSON 用于机器处理，Text 用于终端快速查看）
- **默认输出到 worklog.md**（项目根目录）
- **默认使用 Git 全局配置的作者**进行筛选
- **支持跨平台路径配置**（Windows/Mac 绝对路径）
- **支持 projects 双格式配置**（简单数组/对象数组）
- **无需 GitHub API 或 Token**（仅本地 Git 仓库）

**Non-Goals:**
- 不提供 Web UI 或图形界面（纯 CLI 工具）
- 不支持实时监听 webhook（按需生成报告）
- 不存储历史数据（每次调用实时获取）
- 不支持 GitHub Enterprise（仅本地仓库）
- 不提供团队协作功能（如评论、审批）
- 不访问远程 GitHub API（仅本地 `git log`）

## Decisions

### 决策 1: 使用 Node.js 作为运行时

**选择**: Node.js (npm)

**理由**:
- 用户环境已安装 Node.js 24.14.0，无需额外运行时
- `child_process.execSync` 可方便调用 `git log` 命令
- `commander` 和 `dayjs` 生态成熟，代码简洁
- 与 OpenClaw 技能体系一致（JavaScript/TypeScript）

### 决策 2: 使用 `git log` 命令而非 Git 库

**选择**: 调用 `git log` 命令行

**理由**:
- 无需额外依赖（如 nodegit、isomorphic-git）
- 性能更好（直接调用系统 Git）
- 功能完整（支持所有 `git log` 参数）
- 维护成本低（Git 命令稳定）

**替代方案**: 使用 Node.js Git 库
- 优点：纯 JavaScript 实现
- 缺点：依赖体积大，性能较差，维护复杂

### 决策 3: 顺序获取而非并发获取 commits

**选择**: 使用 `for...of` 顺序获取

**理由**:
- 代码简单，错误处理清晰
- 用户通常追踪 2-5 个项目，性能影响可接受（每个仓库 ~100ms）
- 避免并发执行多个 `git log` 命令

**替代方案**: `Promise.all()` 并发获取
- 优点：总耗时更短
- 缺点：错误处理复杂，资源竞争

### 决策 4: 使用 Conventional Commits 分类

**选择**: 按 commit message 前缀分类（feat/fix/docs/style/refactor/test/chore）

**理由**:
- 业界标准，大多数项目遵循
- 自动生成结构化报告，便于阅读
- 不规范的 commits 归入 "other" 类别

**替代方案**: 不分类，按时间排序
- 优点：实现简单
- 缺点：报告缺乏结构，难以快速定位重要变更

### 决策 5: 配置文件使用 JSON 而非 YAML

**选择**: JSON (config.json)

**理由**:
- Node.js 原生支持 `JSON.parse()`，无需额外依赖
- 语法严格，减少解析错误
- 与 package.json 风格一致

**替代方案**: YAML (config.yaml)
- 优点：支持注释，人类可读性更好
- 缺点：需要 js-yaml 依赖，解析可能失败

### 决策 6: 日报精简格式 vs 详细格式

**选择**: 日报使用单行摘要格式，周报/月报/年报使用详细格式

**理由**:
- 日报：快速浏览，站会场景，需要简洁（`项目 A：任务 1，任务 2`）
- 周报/月报/年报：详细回顾，需要完整信息和分类统计
- 区分使用场景，提升用户体验

**日报格式示例**:
```
项目 A：feat: 新增登录功能，fix: 修复样式问题
项目 B：docs: 更新 README，refactor: 优化架构
```

**详细格式**: 按 Conventional Commits 分类，显示 SHA、作者、日期等

### 决策 7: 默认输出到 worklog.md

**选择**: 默认输出到 `./worklog.md`（项目根目录）

**理由**:
- 符合日常工作日志习惯
- 便于纳入版本控制（可选）
- 可通过 .gitignore 忽略
- 支持通过 -o 参数自定义

**替代方案**: 仅输出到终端
- 优点：无文件残留
- 缺点：不便于历史回顾和分享

### 决策 8: 默认使用 Git 全局配置作者

**选择**: 未指定 --author 时自动读取 `git config --global user.name`

**理由**:
- 开发者通常已配置 Git 全局用户
- 减少命令行参数，简化使用
- 符合"查看我的 commits"的常见场景

**降级处理**: 如果 Git 未配置 user.name，则不筛选作者，显示所有 commits

### 决策 9: 支持跨平台路径配置

**选择**: config.json 中提供 Windows 和 macOS 两种路径格式示例

**理由**:
- 用户可能在多平台间切换
- 绝对路径更可靠（相对路径受工作目录影响）
- 使用 Node.js `path.resolve()` 自动适配

**配置示例**:
```json
{
  "projects": [
    "/Users/dale/repo/commit-reporter",  // macOS
    // "C:\\Users\\dale\\repo\\commit-reporter"  // Windows
  ]
}
```

### 决策 10: projects 字段双格式支持

**选择**: 支持简单数组 `["/path/to/repo"]` 和对象数组 `[{"name": "项目 A", "path": "/path/to/repo"}]`

**理由**:
- 简单数组：快速配置，适合个人使用
- 对象数组：支持自定义项目名称，适合报告展示
- 向后兼容，降低迁移成本

## Risks / Trade-offs

### [风险 1] 本地仓库路径变更

**描述**: 用户移动仓库位置后，config.json 中的路径失效。

**缓解**:
- 使用相对路径（相对于 config.json）
- 提供路径验证错误提示
- 未来可添加路径自动更新功能

### [风险 2] Commit Message 不规范

**描述**: 部分项目不使用 Conventional Commits，导致分类不准确。

**缓解**:
- 不规范的 commits 归入 "other" 类别
- 在报告中说明分类基于 commit message 前缀
- 未来可添加自定义分类规则

### [风险 3] 大仓库性能问题

**描述**: 活跃项目可能有数千 commits，`git log` 响应慢。

**缓解**:
- 时间范围过滤在 `git log` 命令中执行（`--since`/`--until`）
- 限制最大 commits 数量（可选 --limit 参数）
- 使用 `git log --oneline` 减少输出

### [风险 4] 中文路径兼容性问题

**描述**: 之前项目中遇到中文路径文件访问问题。

**缓解**:
- 输出目录使用英文路径
- 避免在文件名中使用中文
- 使用 `path.resolve()` 处理跨平台路径

### [风险 5] Git 未安装或版本过低

**描述**: 用户系统未安装 Git 或版本过旧。

**缓解**:
- 启动时检查 `git --version`
- 提供清晰的安装指南
- 最低要求 Git 2.0+

## Migration Plan

### 部署步骤

1. 安装依赖：`npm install`
2. 配置项目：编辑 `config.json` 添加本地仓库路径
3. 测试运行：`node index.js -p /Users/dale/repo/commit-reporter -t day`

### 回滚策略

- 无数据库或状态迁移，直接删除项目即可
- 生成的报告文件独立，可手动删除

## Open Questions

1. **是否需要支持远程仓库？** 当前版本仅支持本地仓库，未来可考虑添加 `git fetch` 后分析。

2. **是否需要添加缓存机制？** 当前版本每次实时获取，未来可考虑缓存最近一次结果。

3. **是否需要支持 GitLab/Gitee？** 当前基于 `git log`，理论上支持所有 Git 托管平台。

4. **worklog.md 是否应该默认纳入 .gitignore？** 建议默认忽略，避免提交敏感信息。
