# cli-interface Specification

## Purpose
TBD - created by archiving change initial-project-setup. Update Purpose after archive.
## Requirements
### Requirement: 支持命令行参数解析
系统 SHALL 使用 commander 库解析命令行参数。

#### Scenario: 显示帮助信息
- **WHEN** 用户提供 --help 或 -h 参数
- **THEN** 显示完整的帮助信息和所有可用选项

#### Scenario: 显示版本号
- **WHEN** 用户提供 --version 参数
- **THEN** 显示当前版本号（1.0.0）

### Requirement: 项目参数支持
系统 SHALL 支持通过命令行指定要追踪的项目。

#### Scenario: 单个项目
- **WHEN** 用户提供 -p "owner/repo"
- **THEN** 仅追踪该项目的 commits

#### Scenario: 多个项目
- **WHEN** 用户提供 -p "owner/repo1,owner/repo2"
- **THEN** 追踪所有指定项目的 commits

### Requirement: 时间范围参数支持
系统 SHALL 支持通过命令行指定报告时间范围。

#### Scenario: 预设时间范围
- **WHEN** 用户提供 -t day|week|month|year
- **THEN** 使用对应的时间范围

#### Scenario: 默认时间范围
- **WHEN** 用户未指定 -t 参数
- **THEN** 默认使用 week（7 天）

#### Scenario: 自定义日期范围
- **WHEN** 用户提供 --since 和 --until 参数
- **THEN** 使用指定的日期范围

### Requirement: 输出控制参数
系统 SHALL 支持控制报告输出格式和位置。

#### Scenario: 指定输出文件
- **WHEN** 用户提供 -o <filepath>
- **THEN** 将报告写入指定文件

#### Scenario: 默认输出到 worklog.md
- **WHEN** 用户未指定 -o 参数
- **THEN** 将报告写入 `./worklog.md`（项目根目录）

#### Scenario: 指定输出格式
- **WHEN** 用户提供 -f markdown|json|text
- **THEN** 使用指定格式生成报告

### Requirement: 作者筛选参数
系统 SHALL 支持按作者筛选 commits，默认使用 Git 全局配置。

#### Scenario: 按作者筛选
- **WHEN** 用户提供 -a <author-name>
- **THEN** 仅显示该作者的 commits

#### Scenario: 默认使用 Git 配置作者
- **WHEN** 用户未指定 -a 参数
- **THEN** 自动读取 `git config --global user.name` 作为默认作者

#### Scenario: Git 未配置作者
- **WHEN** 用户未指定 -a 且 git config 未设置 user.name
- **THEN** 不筛选作者，显示所有作者的 commits

### Requirement: 进度提示
系统 SHALL 在执行过程中显示清晰的进度提示。

#### Scenario: 显示当前处理的仓库
- **WHEN** 开始获取某个仓库的 commits
- **THEN** 显示 "⏳ Fetching <repo>..."

#### Scenario: 显示获取结果
- **WHEN** 完成获取某个仓库的 commits
- **THEN** 显示 "✓ <count> commits"

#### Scenario: 显示报告边界
- **WHEN** 输出报告时
- **THEN** 使用 "--- REPORT START ---" 和 "--- REPORT END ---" 标记

