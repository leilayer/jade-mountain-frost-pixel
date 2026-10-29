# Zotero 查重助手（Chrome 扩展）

浏览论文、或者准备往 Zotero 里添加文献时，自动告诉你**这篇文献是不是已经在你的 Zotero 文库里**，避免重复添加。

## 功能

- **文献页面自动检测**：打开期刊/预印本/数据库的文献页面时，右下角弹出提示卡片，工具栏图标显示角标：
  - `✓` 绿色：已在 Zotero 库中（可一键“在 Zotero 中打开”定位到该条目）
  - `?` 橙色：库中有标题相似的条目（例如预印本与正式发表版本），请核对
  - `+` 灰色：不在库中，可以放心添加
  - `!` 红色：读不到 Zotero 文库（看弹窗里的提示）
- **搜索结果 / 参考文献标记**：在 Google 学术、PubMed、arXiv、知网、百度学术、Semantic Scholar、Web of Science、IEEE Xplore 的结果列表，以及任何页面上的 DOI 链接旁，给已收录的文献加上 `✓ Zotero` 标记。
- **手动 / 批量查询**：点击工具栏图标，粘贴 DOI、arXiv 号、PMID、ISBN、网址、标题，或者整段参考文献（每行一条），一次查出哪些已收录、哪些没有。
- **保存后自动刷新**：用 Zotero Connector 保存当前文献后，回到页面提示会自动变成“已在 Zotero 库中”。
- **离线可用**：本地模式下 Zotero 关闭时，使用上次同步的缓存继续判断。
- 支持**群组文库**。

### 匹配规则

| 依据 | 结果 |
| --- | --- |
| DOI（包括 Extra 字段和网址中的 DOI）、arXiv 号（忽略版本号）、PMID、ISBN（10/13 位互通）、网址 | 已收录 |
| 标题完全一致（忽略大小写、标点、空格、HTML 标记） | 已收录；若双方 DOI 不同则为“可能重复” |
| 标题相似度 ≥ 阈值（默认 85%，可在设置里调） | 可能重复 |
| 一整条参考文献里包含库中某篇文献的完整标题 | 已收录 |

中文标题同样适用（对词序调整更宽容）。

## 安装

1. 打开 `chrome://extensions`，右上角开启 **开发者模式**。
2. 点击 **加载已解压的扩展程序**，选择本目录 `zotero-checker-extension/`。
3. 安装后会自动打开设置页，按下面任选一种方式连接文库。

Edge、Brave、Arc 等 Chromium 内核浏览器同样适用（Chrome 111 及以上）。

## 连接 Zotero 文库

### 方式一：本地 Zotero 7（推荐）

1. 使用 Zotero 7 或更新版本，并保持 Zotero 运行。
2. Zotero → 设置 → 高级 → 杂项，勾选 **“允许此计算机上的其他应用程序与 Zotero 通讯”**（Allow other applications on this computer to communicate with Zotero）。
3. 在扩展设置页点击“测试连接并同步”。

扩展通过 Zotero 自带的本地 API（`http://127.0.0.1:23119/api/`）只读访问文库，数据不会离开你的电脑。

### 方式二：Zotero 网页 API

适合 Zotero 不常开着、但文库已同步到 zotero.org 的情况。

1. 到 <https://www.zotero.org/settings/keys/new> 创建一个 API Key，勾选 **Allow library access**（只读即可）；需要群组文库的话再给群组授予读取权限。
2. 在扩展设置页选择“Zotero 网页 API”，粘贴 Key，点击“验证”。

## 工作原理

- 后台把文库里每个条目的 DOI / arXiv / PMID / ISBN / 网址 / 标题整理成一个精简索引，缓存在浏览器本地（`chrome.storage.local`）。
- 每次检查前先用一个很小的请求比对文库版本号（本地模式至多每 15 秒一次，网页 API 每 60 秒一次），文库有变化才重新下载；网页 API 只拉取变化的条目。
- 内容脚本读取页面里的 `citation_doi`、`citation_title`、Dublin Core、PRISM 等元数据，以及网址中的 DOI / arXiv / PubMed 号。没有文献元数据的普通网页只会在本地缓存里按网址查一下，不会去请求 Zotero。

## 开发

```bash
cd zotero-checker-extension
npm test          # 匹配与 API 客户端的单元测试（Node 22+，无依赖）
```

目录结构：

```
manifest.json
src/background.js        后台：同步文库、维护索引、更新角标
src/lib/normalize.js     DOI / arXiv / ISBN / 网址 / 标题规范化
src/lib/library-index.js 索引与匹配逻辑
src/lib/zotero-api.js    Zotero 本地 API 与网页 API 客户端
src/content/content.js   页面元数据提取、提示卡片、结果列表标记
src/popup/               工具栏弹窗
src/options/             设置页
```
