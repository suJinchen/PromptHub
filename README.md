# PromptHub

PromptHub 是一个面向 GPT Image 2 / AI 图片创作者的提示词灵感库网站。当前前端 MVP 聚焦静态内容展示、搜索、分类浏览、详情页复制和本地收藏，不接入在线生图、真实登录、数据库、支付或后台审核。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- 本地 JSON 数据源
- ESLint

## 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问：

```text
http://localhost:3000
```

## 构建与检查

生产构建：

```bash
npm run build
```

启动生产服务：

```bash
npm run start
```

代码检查：

```bash
npm run lint
```

数据校验：

```bash
node scripts/validate-data.mjs
```

## 页面路由

- `/`：首页，展示 Hero、探索分类和精选提示词
- `/prompts`：提示词库，支持搜索、分类筛选、标签筛选和排序
- `/prompts/[slug]`：提示词详情页，展示图片、中文提示词、English Prompt、参数建议和相关推荐
- `/categories`：分类页
- `/categories/[slug]`：分类详情页
- `/search`：搜索结果页，支持 `q` 参数，例如 `/search?q=人像`
- `/submit`：投稿功能即将开放页，当前不展示投稿表单
- `/about`：关于页
- `/_not-found`：404 空状态页面

## 数据位置

当前阶段使用本地 JSON 数据，不需要数据库和环境变量。

- `src/data/prompts.json`：提示词数据
- `src/data/categories.json`：分类数据
- `src/data/tags.json`：标签数据
- `src/data/*.backup.json`：历史数据备份
- `src/lib/prompts.ts`：提示词读取、排序、相关推荐和统计
- `src/lib/categories.ts`：分类读取
- `src/lib/search.ts`：本地模糊搜索、分类筛选、标签筛选和排序
- `scripts/import-github-prompts.mjs`：从公开资料导入提示词样本
- `scripts/validate-data.mjs`：校验提示词、分类和标签字段完整性
- `scripts/enrich-image-metadata.mjs`：补充图片尺寸和比例信息

提示词数据兼容字段包括：

- `title` / `slug` / `description`
- `category` / `categoryName` / `categorySlug`
- `tags`
- `coverImage` / `image` / `imageUrl`
- `chinesePrompt` / `cnPrompt` / `zhPrompt`
- `englishPrompt` / `enPrompt`
- `model` / `ratio` / `aspectRatio` / `aspectRatioLabel` / `style` / `useCases`
- `views` / `favorites` / `likes`
- `sourceName` / `sourceUrl`
- `imageFit`

`sourceName` 和 `sourceUrl` 会继续保留在数据层与校验脚本中，便于后续维护、版权处理和数据追踪；当前前台页面不直接展示这些来源字段。

## 环境变量

当前项目不需要配置环境变量，因此暂未提供 `.env.example`。后续接入数据库、真实投稿、登录或第三方图片服务时，再新增 `.env.example` 并列出必填项。

## 后续接入真实后端建议

建议按以下顺序渐进接入：

1. 保持现有 `src/lib/*` 数据层 API 不变，先把 JSON 替换为服务端读取。
2. 使用 Prisma + SQLite 或 PostgreSQL 建立 `Prompt`、`Category`、`Tag`、`Source` 等模型。
3. 投稿页恢复表单后，新增服务端 API，并保留审核状态字段。
4. 登录系统只在需要“我的收藏、投稿记录、后台审核”时接入。
5. 收藏功能可以先从 localStorage 迁移到用户表关联数据。
6. 真实数据导入建议继续使用独立脚本，不要把导入逻辑写进页面组件。

## 当前上线状态

当前项目适合作为静态内容展示型 MVP 部署。上线前建议继续确认远程图片可访问性、版权说明和静态部署配置。
