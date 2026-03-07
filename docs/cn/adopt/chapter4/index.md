# 第四章 Skills 技能系统

OpenClaw 的技能系统就像手机的 App Store，让你可以为龙虾安装各种能力扩展。想让它查天气？安装天气技能。想让它管理 Gmail？安装邮件技能。截至 2026 年初，社区维护的 ClawHub 注册表已有超过 5,700 个技能，覆盖生产力、开发、运维、内容创作等多个领域。

## 1. 什么是技能

技能（Skill）本质上是一组工具定义和使用说明的组合，以 `SKILL.md` 文件为核心，存储在 `~/.openclaw/skills/` 目录下。每个技能包含三个核心部分：

**工具定义**：告诉 OpenClaw 这个技能能做什么。比如天气技能提供 `get_weather` 工具，可以查询指定城市的天气。

**配置模板**：定义技能需要哪些配置信息。比如 Gmail 技能需要 API 密钥和邮箱地址。

**提示词指令**：教 OpenClaw 如何更好地使用这些工具。比如"查询天气时优先使用用户所在城市"。

安装技能后，OpenClaw 会动态加载——不需要重启，下一轮对话立即生效。你不需要每次都详细解释怎么做，只需要说"帮我查天气"，OpenClaw 就知道该调用哪个工具。

### 1.1 技能的形式化定义

从计算理论的视角，OpenClaw 的技能系统可以用有限自动机（Finite Automaton）来形式化描述。一个技能的生命周期可表示为一个确定性有限自动机（DFA）五元组：

$$M = (Q, \Sigma, \delta, q_0, F)$$

其中：

- **Q**（状态集）= {未安装, 已安装, 活跃, 已禁用, 更新中, 错误}
- **Sigma**（输入字母表）= {install, activate, deactivate, update, uninstall, error, resolve}
- **delta**（转移函数）：定义状态之间的转换规则
- **q0**（初始状态）= 未安装
- **F**（接受状态集）= {活跃}

状态转移关系如下：

```
未安装 --install--> 已安装 --activate--> 活跃
活跃 --deactivate--> 已禁用 --activate--> 活跃
活跃 --update--> 更新中 --resolve--> 活跃
活跃 --error--> 错误 --resolve--> 活跃
活跃 --uninstall--> 未安装
已禁用 --uninstall--> 未安装
错误 --uninstall--> 未安装
```

这个形式化模型的意义在于：

1. **状态可预测**：技能在任意时刻只能处于一个确定状态，避免了"薛定谔的插件"问题
2. **转换可验证**：每个操作（输入符号）只能在特定状态下执行，非法操作会被拒绝
3. **生命周期可追踪**：通过记录状态转移序列，可以完整还原技能的使用历史

在实际使用中，OpenClaw 会在安装时自动将技能从"未安装"转移到"已安装"并立即"激活"（合并为一步），但底层仍然遵循这个状态机模型。

## 2. ClawHub：技能注册表

OpenClaw 社区维护了一个名为 ClawHub 的技能注册表（类似 npm 之于 Node.js），托管在 `github.com/openclaw/clawhub`。你可以通过 `clawhub` 命令行工具浏览和管理技能。

### 2.1 浏览和搜索技能

<!-- TODO: 补充 clawhub search 命令的终端截图 -->

```bash
# 列出所有可用技能
clawhub list

# 搜索特定类型的技能
clawhub search weather
clawhub search email
clawhub search database
```

### 2.2 安装技能

安装技能有两种方式：

**方式一：通过 clawhub CLI（推荐）**

```bash
clawhub install weather
```

OpenClaw 会自动下载技能文件到 `~/.openclaw/skills/weather/`，解析配置需求，然后引导你完成配置。

**方式二：通过聊天粘贴 GitHub URL**

直接在对话中粘贴包含 `SKILL.md` 的 GitHub 仓库 URL，OpenClaw 会自动识别并安装。

安装完成后可以立即测试：

```
帮我查一下明天的天气
```

### 2.3 管理已安装的技能

```bash
# 查看已安装的技能
clawhub list

# 更新单个技能
clawhub update weather

# 更新所有技能
clawhub update --all

# 卸载技能
clawhub uninstall weather
```

## 3. 技能文件结构

### 3.1 SKILL.md 格式

每个技能的核心是一个 `SKILL.md` 文件，使用 YAML frontmatter 定义元数据：

```markdown
---
name: weather
description: 查询全球城市天气预报和空气质量
version: 1.2.0
requirements:
  - curl
---

# Weather Skill

当用户询问天气相关问题时，使用以下工具获取数据。

## 使用规则

1. 优先使用用户所在城市
2. 默认返回未来 3 天的天气
3. 如果用户关心空气质量，一并返回 AQI 数据

## 工具

### get_weather
- 参数：city (string), days (number, default: 3)
- 用途：获取指定城市未来 N 天的天气预报
```

frontmatter 字段说明：

| 字段 | 说明 | 必填 |
|------|------|------|
| name | 技能标识符，对应 clawhub 中的 slug | 是 |
| description | 一句话功能描述 | 是 |
| version | 语义化版本号 | 是 |
| requirements | 系统依赖列表（如 python3, curl） | 否 |

### 3.2 目录结构

一个完整的技能目录结构：

```
~/.openclaw/skills/weather/
├── SKILL.md          # 核心：技能说明和指令
├── config.yaml       # 可选：配置模板（API Key 等）
├── scripts/          # 可选：辅助脚本
│   └── fetch.sh
└── examples/         # 可选：使用示例
    └── demo.md
```

## 4. 常用技能推荐

<!-- TODO: 补充每个技能的使用截图 -->

### 4.1 生产力套件

| 技能 | 安装命令 | 功能 |
|------|---------|------|
| Google Workspace (gog) | `clawhub install gog` | Gmail、Calendar、Drive、Docs、Sheets 统一访问 |
| Notion | `clawhub install notion` | 数据库、页面同步，长期记忆存储 |
| Todoist | `clawhub install todoist` | 任务管理、标签、优先级、周期规则 |
| Slack | `clawhub install slack` | 消息发送、频道管理、文件上传 |
| Obsidian | `clawhub install obsidian` | Markdown 笔记库管理，支持 wikilink |

### 4.2 开发工具

| 技能 | 安装命令 | 功能 |
|------|---------|------|
| GitHub | `clawhub install github` | 仓库、Issue、PR 管理，REST API + GraphQL |
| Git Operations | `clawhub install git-ops` | 安全的 Git 命令执行 |
| Code Reviewer | `clawhub install code-reviewer` | Diff 分析、代码审查、Commit 消息生成 |
| SQL Toolkit | `clawhub install sql-toolkit` | PostgreSQL/MySQL/SQLite 只读查询 |
| CI/CD Pipeline | `clawhub install cicd-pipeline` | GitHub/GitLab/Jenkins 流水线控制 |

### 4.3 运维与基础设施

| 技能 | 安装命令 | 功能 |
|------|---------|------|
| DevOps Toolkit | `clawhub install devops` | Docker 编排、进程管理、健康监控 |
| AWS Infrastructure | `clawhub install aws-infra` | EC2、S3、Lambda 对话式管理 |
| Azure DevOps | `clawhub install azure-devops` | 项目、仓库、看板、流水线管理 |

### 4.4 内容与社交

| 技能 | 安装命令 | 功能 |
|------|---------|------|
| LinkedIn | `clawhub install linkedin` | 帖子生成、轮播图、定时发布 |
| X (Twitter) | `clawhub install x-api` | 推文、线程、媒体附件 |
| Blogburst | `clawhub install blogburst` | 长文内容自动拆分为社交媒体帖子 |

### 4.5 个人助理

| 技能 | 安装命令 | 功能 |
|------|---------|------|
| Weather | `clawhub install weather` | 天气、交通、航班实时数据 |
| Calendar Pro | `clawhub install caldav-calendar` | 多日历集成、冲突检测 |
| AgentMail | `clawhub install agentmail` | IMAP/SMTP 邮件管理、线程摘要、自动回复 |
| Home Assistant | `clawhub install home-assistant` | 智能家居设备控制 |

### 4.6 特殊技能

| 技能 | 安装命令 | 功能 |
|------|---------|------|
| Playwright | `clawhub install playwright` | 无头浏览器自动化、表单填写、数据提取 |
| Hacker News | `clawhub install hackernews` | 技术新闻摘要和个性化推送 |
| Self-Improving | `clawhub install self-improving` | 记录成功/失败执行，自我优化模式识别 |

## 5. 配置技能

安装后可以随时修改技能配置。配置文件位于 `~/.openclaw/skills/<skill-name>/config.yaml`：

```yaml
# ~/.openclaw/skills/weather/config.yaml
api_key: "your_api_key"
default_city: "Beijing"
units: "metric"
language: "zh_CN"
```

对于需要 API Key 的技能，安装时会自动引导你输入。你也可以后续手动编辑配置文件。

## 6. 创建自定义技能

如果 ClawHub 上没有你需要的技能，可以自己创建。

### 6.1 最小化技能

创建一个查询 IP 地址的技能，只需要一个 `SKILL.md`：

```markdown
---
name: my-ip
description: 查询当前公网 IP 地址和地理位置
version: 1.0.0
---

# IP 查询技能

当用户询问 IP 地址或网络位置时，执行以下命令：

curl -s https://ipinfo.io/json

返回结果中包含 IP、城市、地区、国家、运营商等信息。
```

### 6.2 安装自定义技能

```bash
# 从本地目录安装
clawhub install ./my-ip

# 或直接复制到技能目录
cp -r my-ip ~/.openclaw/skills/
```

### 6.3 发布到 ClawHub

如果你的技能对他人有用，可以提交到 ClawHub：

```bash
# 1. Fork github.com/openclaw/clawhub
# 2. 添加你的技能目录
# 3. 提交 Pull Request
```

## 7. 飞书插件：技能实战案例

飞书官方插件是一个典型的复合技能，展示了技能如何深度集成外部服务。安装飞书插件后（安装步骤参见第二章 2.4 节），OpenClaw 不仅能通过飞书收发消息，还能直接操作飞书的办公数据：

| 能力 | 说明 |
|------|------|
| 消息 | 群聊/单聊历史搜索、消息发送、文件下载 |
| 文档 | 创建和编辑飞书云文档 |
| 多维表格 | 表格管理与数据操作（类似 Airtable） |
| 日程 | 日历查看、会议创建、忙闲查询 |
| 任务 | 任务和清单的创建与管理 |

使用示例：

```
帮我在飞书上创建一个项目周报文档，包含本周完成的任务和下周计划
```

```
查看我今天的飞书日程，如果有冲突的会议帮我标记出来
```

```
在项目管理多维表格中添加一条新任务：完成 API 文档编写，截止日期下周五
```

这种深度集成体现了技能系统的核心价值：通过标准化的 SKILL.md 接口，将复杂的外部服务能力无缝注入 OpenClaw 的执行循环中。

## 8. 技能系统的性能考量

技能并非越多越好。每个活跃技能都会增加上下文加载量，影响响应速度。建议：

**按需安装**：只安装真正需要的技能。5-10 个常用技能是一个合理的数量。

**定期清理**：卸载不再使用的技能，保持系统精简。

**保护敏感信息**：技能配置中的 API 密钥存储在本地，但仍要注意不要将 `~/.openclaw/skills/` 目录上传到公开仓库。

**测试后再用**：新安装的技能先在测试环境试用，确认没问题后再用于生产任务。

---

**下一步**：[第五章 外部服务集成](/cn/adopt/chapter5/)
