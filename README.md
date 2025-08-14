# 📚 HBFU Plus

一个基于 **Next.js + Tauri** 的河北金融学院个人教务系统查询工具。
精简教务系统查询功能，提供更便捷的查询方式以及更美观的界面。

---

## 🚀 技术栈

* **前端**：Next.js 15，TypeScript，Tailwind CSS V4
* **客户端**：Tauri (Rust)
* **UI 库**：Shadcn UI、Lucide Icons

---

## ✨ 功能介绍

* ✅ **登录**：支持自动保存 cookie、自动登录
* ✅ **个人信息**：支持查询个人信息
* ✅ **课程信息**：支持查询学期课表、导出课表
* ✅ **成绩信息**：支持查询个人成绩、学分、绩点
* ✅ **考试安排**：支持查询考试地点、时间、科目
* ✅ **选课信息**：支持查询个人选课情况
* ✅ **学分信息**：支持查询个人学分情况
* ✅ **第二课堂**：支持查询第二课堂信息、学分详情

---

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/1IANZ/HBFU-Plus.git
cd HBFU-Plus
```

### 2. 安装依赖

```bash
pnpm install   # 推荐使用 pnpm，也可用 npm / yarn
```

### 3. 开发模式运行

```bash
pnpm dev       # 启动 Next.js 开发服务器
```

### 4. 构建桌面应用

```bash
pnpm tauri build   # 使用 Tauri 构建跨平台客户端
```

### 5. 预览桌面应用（调试模式）

```bash
pnpm tauri dev
```

---

## 📜 声明

* 本项目仅用于学习交流，请勿用于违规用途。
* License: MIT
