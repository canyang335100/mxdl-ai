# MXDL AI 导航站

> 发现最好用的AI工具 · mxdl.online

精选收录600+ AI工具，涵盖写作、绘图、视频、编程等全品类。

## 技术栈

- 纯静态站点（HTML + CSS + JS）
- 数据驱动（JSON）
- 部署于 Vercel

## 本地运行

直接使用任意HTTP服务器打开 `index.html`：

```bash
# Python
python -m http.server 3000

# Node
npx serve .
```

## 项目结构

```
├── index.html          # 主页面
├── data/
│   └── tools.json      # 工具数据库
└── README.md
```

## 部署

推送到 GitHub 后，在 Vercel 中选择该仓库即可自动部署。
