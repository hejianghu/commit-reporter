## 1. 项目初始化

- [ ] 1.1 创建项目目录结构（/Users/dale/repo/commit-reporter）
- [ ] 1.2 初始化 Git 仓库并创建 GitHub 远程仓库
- [ ] 1.3 创建 package.json 配置（name, version, scripts, dependencies）
- [ ] 1.4 创建 .gitignore 文件（node_modules, logs, worklog.md, config.local.json）
- [ ] 1.5 创建 README.md 项目文档（仅 npm 安装说明，移除 pip）

## 2. 核心功能实现

- [ ] 2.1 创建 index.js 主入口文件
- [ ] 2.2 实现命令行参数解析（commander 库）
- [ ] 2.3 实现 GitHub API 调用函数（fetchCommits）
- [ ] 2.4 实现时间范围计算函数（getDateRange）
- [ ] 2.5 实现配置文件加载逻辑（config.json）
- [ ] 2.6 实现多项目循环获取逻辑
- [ ] 2.7 实现默认作者获取（git config --global user.name）

## 3. 报告生成模块

- [ ] 3.1 实现 Conventional Commits 分类函数（groupCommitsByType）
- [ ] 3.2 实现日报精简格式生成（单行摘要：`项目 A：任务 1，任务 2`）
- [ ] 3.3 实现周报/月报/年报详细格式生成（分类统计 + 详细信息）
- [ ] 3.4 实现 JSON 格式报告生成（generateJsonReport）
- [ ] 3.5 实现纯文本格式报告生成（generateTextReport）
- [ ] 3.6 实现输出到文件和终端的逻辑
- [ ] 3.7 实现默认输出到 ./worklog.md

## 4. 配置管理

- [ ] 4.1 创建 config.json 模板文件（含 Windows/Mac 路径示例说明）
- [ ] 4.2 实现 projects 字段双格式支持（简单数组/对象数组）
- [ ] 4.3 实现跨平台路径解析（path.resolve 自动适配）
- [ ] 4.4 实现 GitHub Token 支持（config/env/命令行参数）
- [ ] 4.5 实现项目列表管理（配置 + 命令行覆盖）

## 5. 错误处理与优化

- [ ] 5.1 实现 API 速率限制处理（403 错误）
- [ ] 5.2 实现网络错误处理（超时、连接失败）
- [ ] 5.3 实现仓库不存在错误处理（404 错误）
- [ ] 5.4 添加进度提示信息（Fetching/✓）
- [ ] 5.5 实现 Git 未配置作者时的降级处理

## 6. 测试与文档

- [ ] 6.1 测试日报生成（--timeframe day，精简格式）
- [ ] 6.2 测试周报生成（--timeframe week，详细格式）
- [ ] 6.3 测试月报生成（--timeframe month）
- [ ] 6.4 测试多项目追踪（-p 参数）
- [ ] 6.5 测试默认作者筛选（未指定 -a）
- [ ] 6.6 测试默认输出到 worklog.md（未指定 -o）
- [ ] 6.7 测试不同输出格式（-f markdown/json/text）
- [ ] 6.8 完善 README.md 使用示例和配置说明
- [ ] 6.9 添加 config.json 配置说明（Windows/Mac 路径示例）

## 7. OpenSpec 流程

- [ ] 7.1 创建 proposal.md（已完成 ✅）
- [ ] 7.2 创建 specs/ 目录和规格文档（已完成 ✅）
- [ ] 7.3 创建设计 design.md（已完成 ✅）
- [ ] 7.4 创建任务列表 tasks.md（本文件，需更新）
- [ ] 7.5 执行 openspec validate 验证
- [ ] 7.6 执行 openspec archive 归档
