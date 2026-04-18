# HighlightBox - Obsidian 高亮插件

HighlightBox 是一款 Obsidian 插件，支持自定义颜色高亮文本，并在高亮文本前显示带文字的圆角矩形标注框。

---

## 功能特点

- **自定义高亮颜色**：提供多种预设颜色，也可选择自定义颜色
- **圆角矩形标注**：可在高亮文本前（或后）显示带自定义文字的圆角矩形
- **多种触发方式**：支持侧边栏图标、右键菜单、命令面板
- **去除高亮功能**：支持移除已有的 HighlightBox 高亮效果
- **设置持久化**：保存默认颜色偏好
- **跨平台支持**：支持 Windows、macOS、Linux

---

## 安装方法

### 手动安装

1. 将 `main.js`、`styles.css`、`manifest.json` 复制到你的 vault：
   ```
   <YourVault>/.obsidian/plugins/highlightbox/
   ```
2. 打开 Obsidian，进入 **设置 → 社区插件**
3. 启用 **HighlightBox**

### 从源码构建

```bash
npm install
npm run build
```

构建完成后，将生成的文件复制到 Obsidian 插件文件夹。

---

## 使用方法

### 方式一：右键菜单

1. 在笔记中选中需要高亮的文本
2. 右键点击，打开右键菜单
3. 选择 **"使用 HighlightBox 高亮"**
4. 从颜色选择面板中选择高亮颜色
5. （可选）在输入框中输入圆角矩形内要显示的文字
6. 选择 **"注释在前"**（矩形在文本前）或 **"注释在后"**（矩形在文本后）

### 方式二：命令面板

1. 在笔记中选中需要高亮的文本
2. 按 `Ctrl+P`（Windows/Linux）或 `Cmd+P`（macOS）打开命令面板
3. 搜索 **"HighlightBox: 高亮文本"** 并执行
4. 参照上方第 4-6 步操作

### 方式三：侧边栏图标

1. 点击左侧边栏的 **高亮图标**（Ribbon 区域）
2. 参照上方第 4-6 步操作

### 去除高亮

如果需要移除已应用的高亮效果：

- **右键菜单**：选中文本后，右键选择 **"去除 HighlightBox 高亮"**
- **命令面板**：按 `Ctrl+P`，搜索 **"去除高亮"** 并执行

---

## 设置

进入 **设置 → HighlightBox** 可自定义以下选项：

- **默认高亮颜色**：设置默认使用的高亮颜色
- **矩形文字颜色**：设置圆角矩形内文字的颜色

---

## 效果示例

应用 HighlightBox 前：
```
这是一段需要高亮的文本
```

应用 HighlightBox 后（以"重要"作为矩形文字）：
```
[重要] 这是一段需要高亮的文本
```

---

## 使用说明 / Usage

### How to Use / 如何使用

#### Method 1: Right-Click Context Menu / 方式一：右键菜单

1. Select text in your note / 在笔记中选中文本
2. Right-click to open context menu / 右键打开菜单
3. Choose **"使用 HighlightBox 高亮"** / Click **"Highlight with HighlightBox"**
4. Select a highlight color / 选择高亮颜色
5. (Optional) Enter text for the rounded rectangle / （可选）输入矩形内的文字
6. Choose **"注释在前"** (before) or **"注释在后"** (after) / Select position

#### Method 2: Command Palette / 方式二：命令面板

1. Select text / 选中文本
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (macOS) / 按下快捷键打开命令面板
3. Search for **"HighlightBox: 高亮文本"** / 搜索并执行命令
4. Follow steps 4-6 above / 参照上方第 4-6 步操作

#### Method 3: Ribbon Icon / 方式三：侧边栏图标

1. Click the **highlighter icon** in the left sidebar / 点击左侧边栏的高亮图标
2. Follow steps 4-6 above / 参照上方第 4-6 步操作

#### Remove Highlight / 去除高亮

- **Context Menu / 右键菜单**: Select text, right-click and choose **"去除 HighlightBox 高亮"** / **"Remove HighlightBox Highlight"**
- **Command Palette / 命令面板**: Press `Ctrl+P`, search **"去除高亮"** / **"Remove Highlight"**

---

## 兼容性

- 兼容 Obsidian v1.0.0 及以上版本
- 支持编辑模式和预览模式
- 兼容大多数 Obsidian 主题
- 已在 Windows、macOS、Linux 上测试通过

---

## 技术细节

- 使用 TypeScript 构建，确保类型安全
- 使用 CodeMirror 6 编辑器 API
- 高效的 DOM 操作，保证性能
- 无外部依赖

---

## 反馈与贡献

欢迎提交问题或 Pull Request！

---

## 许可证

MIT License - 可自由使用和修改。
