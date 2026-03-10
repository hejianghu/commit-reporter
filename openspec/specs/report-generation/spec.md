# report-generation Specification

## Purpose
TBD - created by archiving change initial-project-setup. Update Purpose after archive.
## Requirements
### Requirement: 日报采用精简格式
系统 SHALL 为日报（--timeframe day）生成精简格式的报告。

#### Scenario: 精简格式输出
- **WHEN** 用户指定 --timeframe day 或未指定（默认 week 除外）
- **THEN** 使用单行摘要格式：`项目 A：任务 1，任务 2，任务 3`

#### Scenario: 多项目单行显示
- **WHEN** 有多个项目时
- **THEN** 每个项目占一行，格式为 `项目名：commit 摘要 1, commit 摘要 2, ...`

### Requirement: 周报/月报/年报采用详细格式
系统 SHALL 为周报、月报、年报生成详细的结构化报告。

#### Scenario: 按 Conventional Commits 分类
- **WHEN** 生成周报/月报/年报时
- **THEN** commits 按 feat/fix/docs/style/refactor/test/chore/other 分类显示

#### Scenario: 显示 commit 详细信息
- **WHEN** 展示每个 commit 时
- **THEN** 包含 SHA（短格式）、commit message、作者、日期

#### Scenario: 贡献者统计
- **WHEN** 生成详细报告末尾
- **THEN** 显示所有贡献者列表和总人数

#### Scenario: 无 commits 时的处理
- **WHEN** 指定时间范围内无 commits
- **THEN** 显示 "No commits in this period" 提示

### Requirement: 生成 JSON 格式报告
系统 SHALL 生成机器可读的 JSON 格式报告，包含完整元数据。

#### Scenario: 包含元数据
- **WHEN** 生成 JSON 报告时
- **THEN** 包含 generated、timeframe、dateRange 等元数据字段

#### Scenario: 包含汇总统计
- **WHEN** 生成 JSON 报告时
- **THEN** 包含 totalProjects 和 totalCommits 汇总

### Requirement: 生成纯文本格式报告
系统 SHALL 生成简洁的纯文本格式报告，便于终端查看。

#### Scenario: 简洁格式输出
- **WHEN** 选择 text 格式时
- **THEN** 使用 ASCII 字符绘制分隔线，每行一个 commit

### Requirement: 支持多种时间范围
系统 SHALL 支持 day/week/month/year 四种预设时间范围。

#### Scenario: 日报生成
- **WHEN** 用户指定 --timeframe day
- **THEN** 获取过去 24 小时的 commits，使用精简格式

#### Scenario: 周报生成
- **WHEN** 用户指定 --timeframe week
- **THEN** 获取过去 7 天的 commits，使用详细格式

#### Scenario: 月报生成
- **WHEN** 用户指定 --timeframe month
- **THEN** 获取过去 30 天的 commits，使用详细格式

#### Scenario: 年报生成
- **WHEN** 用户指定 --timeframe year
- **THEN** 获取过去 365 天的 commits，使用详细格式

#### Scenario: 自定义时间范围
- **WHEN** 用户指定 --since 和 --until 参数
- **THEN** 使用自定义日期范围覆盖预设 timeframe

