## Why

GitHub 开发者需要定期追踪多个项目的 commit 动态，手动汇总 commit log 生成日报、周报、月报效率低下。本项目通过自动化工具从 GitHub API 获取 commit 数据，按 Conventional Commits 分类汇总，生成结构化报告，帮助开发者和团队快速了解项目进展。

- **新增**: `commit-reporter` CLI 工具，支持从 GitHub 获取 commit 数据
- **新增**: 4 种时间范围报告生成（日报/周报/月报/年报）
- **新增**: 3 种输出格式（Markdown/JSON/纯文本）
- **新增**: 多项目同时追踪能力
- **新增**: 按作者、时间范围、关键词筛选功能
- **新增**: 自动按 Conventional Commits 分类（feat/fix/docs/refactor/test/chore）
- **新增**: 贡献者统计和汇总
- **新增**: 日报精简模式（单行摘要）vs 周报/月报/年报详细模式
- **新增**: 跨平台路径支持（Windows/Mac 绝对路径配置）
- **新增**: 支持 projects 配置的双格式（简单数组/对象数组）

## Capabilities

### New Capabilities

- `commit-fetch`: 从 GitHub API 获取 commit 数据，支持时间范围、作者筛选
- `report-generation`: 生成多格式报告（Markdown/JSON/Text），支持 Conventional Commits 分类
- `config-management`: 项目配置管理，支持多项目列表、输出目录、默认时间范围配置
- `cli-interface`: 命令行交互界面，支持丰富的选项参数

### Modified Capabilities

<!-- 无修改的现有能力 -->

## Impact

- **依赖系统**: Node.js >= 18.0.0（仅 npm，不支持 pip）
- **外部 API**: GitHub REST API v3（需处理速率限制）
- **配置文件**: `config.json` 存储项目列表、GitHub Token、输出目录（支持 Windows/Mac 绝对路径）
- **输出目录**: 默认输出到 skill 所在目录的 `worklog.md` 文件
- **包管理**: npm (commander, node-fetch, dayjs)
- **Git 配置**: 默认作者筛选使用全局 `git config user.name`
