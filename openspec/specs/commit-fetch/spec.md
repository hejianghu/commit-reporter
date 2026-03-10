# commit-fetch Specification

## Purpose
TBD - created by archiving change initial-project-setup. Update Purpose after archive.
## Requirements
### Requirement: 从 GitHub API 获取 Commit 数据
系统 SHALL 支持从 GitHub REST API v3 获取指定仓库的 commit 历史记录。

#### Scenario: 成功获取单个仓库的 commits
- **WHEN** 用户提供有效的 GitHub 仓库名称（格式：owner/repo）
- **THEN** 系统调用 GitHub API 返回该仓库的 commit 列表

#### Scenario: 按时间范围筛选 commits
- **WHEN** 用户指定 since 和 until 参数（ISO 8601 格式）
- **THEN** 系统仅返回该时间范围内的 commits

#### Scenario: 按作者筛选 commits
- **WHEN** 用户指定 --author 参数
- **THEN** 系统仅返回该作者的 commits

#### Scenario: 默认使用 Git 全局配置的作者
- **WHEN** 用户未指定 --author 参数
- **THEN** 系统自动读取 `git config --global user.name` 作为默认作者筛选

#### Scenario: 处理 API 速率限制
- **WHEN** GitHub API 返回 403 速率限制错误
- **THEN** 系统显示警告信息并继续处理其他仓库

#### Scenario: 处理认证 Token
- **WHEN** 用户提供 GitHub Token
- **THEN** 系统在 API 请求中包含 Authorization 头以提高速率限制

### Requirement: 支持多项目并行获取
系统 SHALL 支持同时从多个 GitHub 仓库获取 commit 数据。

#### Scenario: 批量获取多个仓库
- **WHEN** 用户提供多个仓库名称（逗号分隔）
- **THEN** 系统依次获取每个仓库的 commits 并汇总

#### Scenario: 部分仓库获取失败
- **WHEN** 某个仓库不存在或无访问权限
- **THEN** 系统记录错误并继续处理其他仓库

