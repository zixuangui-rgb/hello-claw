import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config

const baseConfig = '/'

export default defineConfig({
  lang: 'zh-CN',
  title: "Hello Claw",
  description: "从零到一学习 OpenClaw：领养你的 AI 龙虾助理，或从零构建属于你的智能体",
  base: baseConfig,
  markdown: {
    math: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/datawhale-logo.png',
    nav: [
      { text: '领养 Claw', link: '/adopt/' },
      { text: '构建 Claw', link: '/build/' },
      { text: 'GitHub', link: 'https://github.com/datawhalechina/hello-claw' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },
    sidebar: {
      '/adopt/': [
        {
          text: '领养 Claw（使用篇）',
          items: [
            { text: '写在开头', link: '/adopt/' },
            { text: '第1章 十分钟上手 OpenClaw', link: '/adopt/chapter1' },
            { text: '第2章 理解 OpenClaw', link: '/adopt/chapter2' },
            { text: '第3章 移动端接入', link: '/adopt/chapter3' },
            { text: '第4章 自动化任务入门', link: '/adopt/chapter4' },
            { text: '第5章 Skills 技能系统', link: '/adopt/chapter5' },
            { text: '第6章 外部服务集成', link: '/adopt/chapter6' },
            { text: '第7章 生产环境部署', link: '/adopt/chapter7' },
            { text: '第8章 多模型与成本优化', link: '/adopt/chapter8' },
            { text: '第9章 个人助理系统', link: '/adopt/chapter9' },
            { text: '第10章 内容创作工具链', link: '/adopt/chapter10' },
            { text: '第11章 开发者效率提升', link: '/adopt/chapter11' },
            { text: '第12章 故障排查与优化', link: '/adopt/chapter12' }
          ]
        }
      ],
      '/build/': [
        {
          text: '构建 Claw（开发篇）',
          items: [
            { text: '写在开头', link: '/build/' },
            { text: '第1章 Hello Agent', link: '/build/chapter1' },
            { text: '第2章 工具调用', link: '/build/chapter2' },
            { text: '第3章 Agent Loop', link: '/build/chapter3' },
            { text: '第4章 Bash 工具', link: '/build/chapter4' },
            { text: '第5章 解析 SKILL.md', link: '/build/chapter5' },
            { text: '第6章 技能加载与触发', link: '/build/chapter6' },
            { text: '第7章 编写第一个技能', link: '/build/chapter7' },
            { text: '第8章 Telegram Bot', link: '/build/chapter8' },
            { text: '第9章 消息路由', link: '/build/chapter9' },
            { text: '第10章 飞书集成', link: '/build/chapter10' },
            { text: '第11章 对话历史与 SOUL.md', link: '/build/chapter11' },
            { text: '第12章 MEMORY.md 持久化', link: '/build/chapter12' },
            { text: '第13章 Cron 调度器', link: '/build/chapter13' },
            { text: '第14章 OpenClaw 源码导读', link: '/build/chapter14' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/datawhalechina/hello-claw' }
    ],

    editLink: {
      pattern: 'https://github.com/datawhalechina/hello-claw/blob/main/docs/:path'
    },

    footer: {
      message: '<a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2026002630号-1</a> | <a href="https://beian.mps.gov.cn/#/query/webSearch?code=11010602202215" rel="noreferrer" target="_blank">京公网安备11010602202215号</a>',
      copyright: '本作品采用 <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议（CC BY-NC-SA 4.0）</a> 进行许可'
    }
  }
})
