## Context

GitHub 开发者需要定期追踪项目进展，手动汇总 commit 信息耗时且容易遗漏。现有解决方案要么过于复杂（如完整的 CI/CD 平台），要么功能单一（仅显示 commit 列表）。本项目通过轻量级 CLI 工具，提供灵活的报告生成功能。

**技术约束**:
- 使用 Node.js 运行时（用户已安装 Node.js 24.14.0）
- 依赖 GitHub REST API v3（需处理速率限制）
- 无需数据库，纯文件操作
- 支持 macOS/Linux/Windows 跨平台
- **仅使用 npm 安装依赖**（不使用 pip）

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
- 处理 GitHub API 速率限制，提供友好的错误提示
- **默认输出到 worklog.md**（项目根目录）
- **默认使用 Git 全局配置的作者**进行筛选
- **支持跨平台路径配置**（Windows/Mac 绝对路径）
- **支持 projects 双格式配置**（简单数组/对象数组）

**Non-Goals:**
- 不提供 Web UI 或图形界面（纯 CLI 工具）
- 不支持实时监听 webhook（按需生成报告）
- 不存储历史数据（每次调用实时获取）
- 不支持 GitHub Enterprise（仅 github.com）
- 不提供团队协作功能（如评论、审批）
- 不支持 Python/pip 安装（仅 npm）

## Decisions

### 决策 1: 使用 Node.js 而非 Python

**选择**: Node.js (npm)

**理由**:
- 用户环境已安装 Node.js 24.14.0，无需额外运行时
- `node-fetch` 和 `commander` 生态成熟，代码简洁
- 异步 I/O 适合并发获取多个仓库数据
- 与 OpenClaw 技能体系一致（JavaScript/TypeScript）
- **README.md 中仅使用 `npm install`**（不使用 pip）

**替代方案**: Python + requests + click
- 优点：语法更简洁，数据处理库丰富
- 缺点：用户环境需额外安装 Python

### 决策 2: 使用 GitHub REST API v3 而非 GraphQL

**选择**: REST API v3

**理由**:
- Commits 端点功能完整，满足需求（/repos/{owner}/{repo}/commits）
- 支持 since/until/author 等查询参数，无需复杂过滤
- 速率限制清晰（60 次/小时未认证，5000 次/小时认证）
- 学习曲线低，文档完善

**替代方案**: GraphQL API v4
- 优点：灵活查询，减少请求次数
- 缺点：学习成本高，对于简单场景过度设计

### 决策 3: 顺序获取而非并发获取 commits

**选择**: 使用 `for...of` 顺序获取

**理由**:
- 避免并发请求触发 API 速率限制
- 代码简单，错误处理清晰
- 用户通常追踪 2-5 个项目，性能影响可接受（每个仓库 ~500ms）

**替代方案**: `Promise.all()` 并发获取
- 优点：总耗时更短
- 缺点：容易触发速率限制，错误处理复杂

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
  "output_dir": "/Users/dale/repo/commit-reporter/reports",  // macOS
  // "output_dir": "C:\\Users\\dale\\repo\\commit-reporter\\reports",  // Windows
}
```

### 决策 10: projects 字段双格式支持

**选择**: 支持简单数组 `["owner/repo"]` 和对象数组 `[{"name": "项目 A", "path": "owner/repo"}]`

**理由**:
- 简单数组：快速配置，适合个人使用
- 对象数组：支持自定义项目名称，适合报告展示
- 向后兼容，降低迁移成本

## Risks / Trade-offs

### [风险 1] GitHub API 速率限制

**描述**: 未认证用户仅 60 次/小时，追踪多项目时可能超限。

**缓解**:
- 鼓励用户在 config.json 中配置 Token（5000 次/小时）
- 顺序获取 + 错误处理，遇到 403 时跳过并提示
- 未来可添加缓存机制（可选）

### [风险 2] Commit Message 不规范

**描述**: 部分项目不使用 Conventional Commits，导致分类不准确。

**缓解**:
- 不规范的 commits 归入 "other" 类别
- 在报告中说明分类基于 commit message 前缀
- 未来可添加自定义分类规则

### [风险 3] 大仓库性能问题

**描述**: 活跃项目（如 openclaw/openclaw）可能有数千 commits，API 响应慢。

**缓解**:
- GitHub API 默认分页（per_page=100），仅获取第一页
- 时间范围过滤在服务端执行，减少传输数据量
- 未来可添加 --limit 参数限制最大 commits 数量

### [风险 4] 中文路径兼容性问题

**描述**: 之前项目中遇到中文路径文件访问问题。

**缓解**:
- 输出目录使用英文路径
- 避免在文件名中使用中文
- 使用 `path.resolve()` 处理跨平台路径

### [风险 5] 跨平台路径配置复杂

**描述**: Windows 和 macOS 路径格式不同，用户可能配置错误。

**缓解**:
- config.json 提供两种格式的示例注释
- 使用 `path.resolve()` 自动处理路径分隔符
- 文档中明确说明路径配置要求

## Migration Plan

### 部署步骤

1. 安装依赖：`npm install`（**仅 npm，不使用 pip**）
2. 配置项目：编辑 `config.json` 添加要追踪的仓库
3. （可选）配置 Token：在 `config.json` 添加 `github_token`
4. （可选）配置输出目录：设置 `output_dir`（支持 Windows/Mac 绝对路径）
5. 测试运行：`node index.js -p hejianghu/commit-reporter -t day`

### 回滚策略

- 无数据库或状态迁移，直接删除项目即可
- 生成的报告文件独立，可手动删除

## Open Questions

1. **是否需要添加缓存机制？** 当前版本每次实时获取，未来可考虑缓存最近一次结果以减少 API 调用。

2. **是否需要支持 GitHub Enterprise？** 当前仅支持 github.com，企业用户可能需要私有部署。

3. **是否需要添加邮件发送功能？** 当前仅输出到文件/终端，未来可集成 nodemailer 自动发送邮件。

4. **是否需要支持 GitLab/Gitee？** 当前仅支持 GitHub API，未来可抽象适配器支持其他平台。

5. **worklog.md 是否应该默认纳入 .gitignore？** 建议默认忽略，避免提交敏感信息。
