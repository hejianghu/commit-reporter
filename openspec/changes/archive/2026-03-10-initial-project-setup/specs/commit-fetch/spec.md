## ADDED Requirements

### Requirement: 从本地 Git 仓库获取 Commit 数据
系统 SHALL 支持使用 `git log` 命令从本地 Git 仓库获取 commit 历史记录。

#### Scenario: 成功获取单个仓库的 commits
- **WHEN** 用户提供有效的本地仓库路径
- **THEN** 系统调用 `git log` 命令返回该仓库的 commit 列表

#### Scenario: 按时间范围筛选 commits
- **WHEN** 用户指定 since 和 until 参数（YYYY-MM-DD 格式）
- **THEN** 系统使用 `git log --since=<date> --until=<date>` 筛选 commits

#### Scenario: 按作者筛选 commits
- **WHEN** 用户指定 --author 参数
- **THEN** 系统使用 `git log --author=<name>` 筛选 commits

#### Scenario: 默认使用 Git 全局配置的作者
- **WHEN** 用户未指定 --author 参数
- **THEN** 系统自动读取 `git config --global user.name` 作为默认作者筛选

#### Scenario: 处理仓库路径不存在
- **WHEN** 用户提供的本地路径不存在 Git 仓库
- **THEN** 系统显示错误信息并跳过该仓库

### Requirement: 支持多项目并行获取
系统 SHALL 支持同时从多个本地 Git 仓库获取 commit 数据。

#### Scenario: 批量获取多个仓库
- **WHEN** 用户提供多个本地仓库路径
- **THEN** 系统依次获取每个仓库的 commits 并汇总

#### Scenario: 部分仓库获取失败
- **WHEN** 某个路径不是 Git 仓库
- **THEN** 系统记录错误并继续处理其他仓库
