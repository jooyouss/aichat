# AI Chat 应用

这是一个基于 React 和 FastAPI 构建的现代化聊天应用。

## 数据存储

项目使用 SQLite 数据库进行数据存储，主要包含以下数据表：

### User 表
- 用户基本信息（ID、用户名、邮箱等）
- 密码（经过哈希处理）
- 用户简介
- 创建时间

### Post 表
- 帖子内容
- 发布时间
- 作者信息
- 点赞数
- 评论数

数据库文件 (`app.db`) 位于后端目录中，会在首次运行时自动创建。

### 数据库查看和管理

有多种方式可以查看和管理数据库数据：

#### 1. SQLite 命令行工具

```bash
# 进入后端目录
cd backend

# 查看所有表
sqlite3 app.db ".tables"

# 查看表结构
sqlite3 app.db ".schema users"
sqlite3 app.db ".schema posts"

# 查询数据（基本格式）
sqlite3 app.db "SELECT * FROM users;"
sqlite3 app.db "SELECT * FROM posts;"

# 格式化输出（更易读）
sqlite3 app.db ".mode column"
sqlite3 app.db ".headers on"
sqlite3 app.db "SELECT * FROM users;"
```

#### 2. 图形界面工具（推荐）

推荐使用 DB Browser for SQLite：
- 下载地址：https://sqlitebrowser.org/
- 安装后直接打开 `backend/app.db` 文件
- 提供可视化的数据浏览、编辑和查询功能
- 适合不熟悉 SQL 命令的用户

#### 3. Python 交互式环境

```python
# 进入后端目录并启动 Python
cd backend
python

# 在 Python 环境中：
from app.database import SessionLocal
from app.models import User, Post

# 创建数据库会话
db = SessionLocal()

# 查询用户
users = db.query(User).all()
for user in users:
    print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")

# 查询帖子
posts = db.query(Post).all()
for post in posts:
    print(f"ID: {post.id}, Content: {post.content}, Author: {post.author.username}")

# 关闭会话
db.close()
```

#### 4. FastAPI Swagger UI

- 访问 http://localhost:8000/docs
- 使用交互式 API 文档查看数据
- 支持直接测试 API 端点
- 适合通过 API 查看数据

### 数据库管理注意事项

1. 数据安全
   - 定期备份 `app.db` 文件
   - 不要在生产环境直接修改数据库
   - 保护好数据库文件的访问权限

2. 开发建议
   - 使用 DB Browser 进行可视化操作
   - 使用 Python 环境进行调试
   - 保持良好的数据库查询习惯

## 项目结构

```
aichat/
├── backend/         # 后端服务
│   ├── app/        # 应用代码
│   │   ├── models.py     # 数据库模型
│   │   ├── database.py   # 数据库配置
│   │   └── crud.py       # 数据库操作
│   ├── app.db     # SQLite 数据库文件
│   ├── venv/      # Python 虚拟环境
│   └── main.py    # 主程序入口
└── frontend/      # 前端应用
    ├── src/       # 源代码
    └── public/    # 静态资源
```

# AI Chat 应用

这是一个基于 React 和 FastAPI 构建的现代化聊天应用。

## 项目结构

```
aichat/
├── backend/         # 后端服务
│   ├── app/        # 应用代码
│   ├── venv/       # Python 虚拟环境
│   └── main.py     # 主程序入口
└── frontend/       # 前端应用
    ├── src/        # 源代码
    └── public/     # 静态资源
```

## 技术栈

### 后端
- Python 3.x
- FastAPI
- SQLAlchemy
- Pydantic
- uvicorn

### 前端
- React
- TypeScript
- Material-UI
- Redux Toolkit
- Axios

## 功能特性

- 用户认证（登录/注册）
- Token 基于时间的自动过期（3小时）
- 无痛刷新机制
- 响应式设计
- 用户状态管理
- RESTful API

## 快速开始

### 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 创建并激活虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Unix/macOS
# 或
.\venv\Scripts\activate  # Windows
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 启动服务器：
```bash
python main.py
```

服务器将在 http://localhost:8000 运行

### 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

应用将在 http://localhost:3001 运行

## 使用说明

1. 访问 http://localhost:3001
2. 使用默认账号登录：
   - 邮箱：admin@example.com
   - 密码：admin123
3. 登录后即可使用应用功能

## 安全特性

- 密码加密存储
- JWT token 认证
- 自动 token 过期机制
- 请求拦截器自动处理认证
- 安全的状态管理

## 开发说明

- 后端 API 文档：访问 http://localhost:8000/docs
- 前端使用 TypeScript 确保类型安全
- 使用 Redux Toolkit 进行状态管理
- 实现了完整的错误处理机制

## 注意事项

1. 确保后端服务器在前端应用启动前运行
2. 默认 token 过期时间为 3 小时
3. 刷新页面会自动验证登录状态
4. 支持自动重定向到登录页面

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License