# config-management Specification

## Purpose
TBD - created by archiving change initial-project-setup. Update Purpose after archive.
## Requirements
### Requirement: 从 config.json 加载配置
系统 SHALL 从项目根目录的 config.json 文件加载默认配置。

#### Scenario: 成功加载配置文件
- **WHEN** config.json 存在且格式正确
- **THEN** 系统加载 projects、output_dir、default_timeframe 等配置

#### Scenario: 配置文件不存在
- **WHEN** config.json 不存在
- **THEN** 系统使用空配置，要求用户通过命令行参数指定项目

#### Scenario: 配置文件格式错误
- **WHEN** config.json 格式无效（非 JSON）
- **THEN** 系统显示错误信息并使用空配置

### Requirement: 支持跨平台绝对路径配置
系统 SHALL 支持在 config.json 中配置 Windows 和 macOS 不同格式的绝对路径。

#### Scenario: macOS 路径格式
- **WHEN** config.json 中 output_dir 为 `/Users/dale/repo/commit-reporter/reports`
- **THEN** 系统正确解析并使用该路径

#### Scenario: Windows 路径格式
- **WHEN** config.json 中 output_dir 为 `C:\\Users\\dale\\repo\\commit-reporter\\reports`
- **THEN** 系统正确解析并使用该路径

#### Scenario: 路径配置说明
- **WHEN** 用户查看 config.json 示例
- **THEN** 提供 Windows 和 macOS 两种格式的示例注释

### Requirement: 支持 GitHub Token 配置
系统 SHALL 支持通过配置文件或环境变量提供 GitHub API Token。

#### Scenario: 从 config.json 读取 Token
- **WHEN** config.json 中包含 github_token 字段
- **THEN** 系统使用该 Token 进行 API 认证

#### Scenario: 从环境变量读取 Token
- **WHEN** 设置 GITHUB_TOKEN 环境变量
- **THEN** 系统使用该 Token 进行 API 认证

#### Scenario: 命令行参数覆盖
- **WHEN** 用户提供 --token 参数
- **THEN** 该 Token 覆盖配置文件和环境变量中的设置

### Requirement: 项目列表支持双格式配置
系统 SHALL 支持 projects 字段的两种配置格式：简单数组和对象数组。

#### Scenario: 简单数组格式
- **WHEN** config.json 中 projects 为 `["owner/repo1", "owner/repo2"]`
- **THEN** 系统使用仓库全名作为显示名称

#### Scenario: 对象数组格式
- **WHEN** config.json 中 projects 为 `[{"name": "项目 A", "path": "owner/repo1"}]`
- **THEN** 系统使用 name 字段作为报告中的显示名称

#### Scenario: 混合格式兼容性
- **WHEN** config.json 中同时存在两种格式
- **THEN** 系统自动检测并兼容处理

#### Scenario: 命令行参数覆盖项目列表
- **WHEN** 用户提供 --projects 参数
- **THEN** 使用该参数覆盖配置文件中的项目列表

### Requirement: 默认输出到 worklog.md
系统 SHALL 默认将报告输出到 skill 所在目录的 worklog.md 文件。

#### Scenario: 默认输出文件
- **WHEN** 用户未指定 --output 参数
- **THEN** 输出到 `./worklog.md`（项目根目录）

#### Scenario: 自定义输出文件
- **WHEN** 用户指定 --output <filepath>
- **THEN** 输出到指定文件路径

#### Scenario: 输出到终端
- **WHEN** 用户指定 --output 为 `-` 或不指定且使用 text 格式
- **THEN** 输出到标准输出（终端）

