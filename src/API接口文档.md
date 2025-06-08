# EWA Business API 详细接口文档

## 通用说明

- 所有接口均为 `POST` 请求，数据格式为 `application/json`。
- 返回格式为统一的 JSON，包含 `code`、`message`、`data` 字段（如无特殊说明）。

---

## 1. 健康检查

- **接口路径**：`/health`
- **方法**：POST
- **功能描述**：服务健康检查
- **请求参数**：无
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
- **响应示例**：
  ```json
  {"code": 200, "message": "ok"}
  ```

---

## 2. 用户注册

- **接口路径**：`/api/register`
- **方法**：POST
- **功能描述**：用户注册
- **请求参数**：
  | 字段     | 类型   | 必填 | 说明     |
  |----------|--------|------|----------|
  | username | string | 是   | 4-16位小写字母或数字 |
  | password | string | 是   | 密码，最少6位 |
- **请求示例**：
  ```json
  {"username": "testuser", "password": "123456"}
  ```
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
  | data   | null   | -        |
- **响应示例**：
  ```json
  {"code": 200, "message": "注册成功", "data": null}
  ```

---

## 3. 用户登录

- **接口路径**：`/api/login`
- **方法**：POST
- **功能描述**：用户登录
- **请求参数**：
  | 字段     | 类型   | 必填 | 说明     |
  |----------|--------|------|----------|
  | username | string | 是   | 用户名   |
  | password | string | 是   | 密码     |
- **请求示例**：
  ```json
  {"username": "testuser", "password": "123456"}
  ```
- **响应参数**：
  | 字段   | 类型   | 说明         |
  |--------|--------|--------------|
  | code   | int    | 状态码       |
  | message| string | 信息         |
  | data   | object | 用户信息     |
- **data结构**：
  | 字段         | 类型   | 说明         |
  |--------------|--------|--------------|
  | id           | int    | 用户ID       |
  | username     | string | 用户名       |
  | status       | string | 用户状态     |
  | role         | string | 角色         |
  | access_token | string | 访问令牌     |
- **响应示例**：
  ```json
  {"code": 200, "message": "登录成功", "data": {"id": 1, "username": "testuser", "status": "active", "role": "user", "access_token": "xxxx"}}
  ```

---

## 4. 获取AI助手信息

- **接口路径**：`/api/assistant/get`
- **方法**：POST
- **功能描述**：获取当前应用的AI助手信息
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | app_key| string | 是   | 应用唯一标识 |
- **请求示例**：
  ```json
  {"app_key": "your_app_key"}
  ```
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
  | data   | object | 助手信息 |
- **响应示例**：
  ```json
  {"code": 200, "message": "获取AI助手信息成功", "data": {"name": "助手名", "icon": "icon.png", "welcome": "欢迎语"}}
  ```

---

## 5. 修改AI助手信息

- **接口路径**：`/api/assistant/update`
- **方法**：POST（`multipart/form-data`）
- **功能描述**：修改AI助手信息（支持上传icon）
- **请求参数**：
  | 字段     | 类型   | 必填 | 说明         |
  |----------|--------|------|--------------|
  | app_key  | string | 是   | 应用唯一标识 |
  | name     | string | 否   | 助手名称     |
  | icon     | file   | 否   | 头像图片     |
  | welcome  | string | 否   | 欢迎语       |
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
  | data   | object | 更新后信息 |
- **响应示例**：
  ```json
  {"code": 200, "message": "AI 助手信息更新成功", "data": {"assistant": {"name": "新助手名", "icon": "icon.png", "welcome": "新欢迎语"}}}
  ```

---

## 6. 保存AI配置

- **接口路径**：`/api/user_ai_config/save`
- **方法**：POST
- **功能描述**：保存对话模型和Embedding模型配置
- **请求参数**：
  | 字段             | 类型   | 必填 | 说明         |
  |------------------|--------|------|--------------|
  | app_key          | string | 是   | 应用唯一标识 |
  | chat_model       | string | 是   | 对话模型     |
  | embedding_model  | string | 是   | 向量模型     |
  | system_prompt    | string | 否   | 系统提示词   |
  | user_prompt      | string | 否   | 用户提示词   |
  | include_context  | int/bool| 否  | 是否包含上下文|
  | include_history  | int/bool| 否  | 是否包含历史  |
  | max_history_length| int   | 否   | 最大历史长度 |
- **响应参数**：同上，返回保存后的配置

---

## 7. 获取AI配置

- **接口路径**：`/api/user_ai_config/get`
- **方法**：POST
- **功能描述**：获取对话模型和Embedding模型配置
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | app_key| string | 是   | 应用唯一标识 |
- **响应参数**：同上，返回配置内容

---

## 8. 会话相关接口

### 8.1 创建会话ID

- **接口路径**：`/api/conversation/create_id`
- **方法**：POST
- **功能描述**：生成14位 conversation_id（格式：年月日时分秒）
- **请求参数**：无
- **响应参数**：
  | 字段             | 类型   | 说明         |
  |------------------|--------|--------------|
  | code             | int    | 状态码       |
  | message          | string | 信息         |
  | data             | object | { conversation_id: string }
- **响应示例**：
  ```json
  {"code": 200, "message": "操作成功", "data": {"conversation_id": "20240608123045"}}
  ```

### 8.2 获取会话列表

- **接口路径**：`/api/conversation/list`
- **方法**：POST
- **功能描述**：获取某用户所有会话的 conversation_id 和 text
- **请求参数**：
  | 字段     | 类型   | 必填 | 说明         |
  |----------|--------|------|--------------|
  | app_key  | string | 是   | 应用唯一标识 |
  | user_id  | string | 是   | 用户唯一标识 |
- **响应参数**：
  | 字段             | 类型     | 说明         |
  |------------------|----------|--------------|
  | code             | int      | 状态码       |
  | message          | string   | 信息         |
  | data             | array    | 会话列表     |
- **data结构**：
  | 字段             | 类型   | 说明         |
  |------------------|--------|--------------|
  | conversation_id  | string | 会话ID       |
  | text             | string | 会话首条内容 |
  | created_at       | int    | 创建时间戳   |
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [
      {"conversation_id": "20240608123045", "text": "你好", "created_at": 1717800000000}
    ]
  }
  ```

### 8.3 聊天接口

- **接口路径**：`/api/chat`
- **方法**：POST
- **功能描述**：与 Ollama 聊天，兼容 OpenAI Chat API，支持流式返回
- **请求参数**：
  | 字段             | 类型   | 必填 | 说明         |
  |------------------|--------|------|--------------|
  | app_key          | string | 是   | 应用唯一标识 |
  | user_id          | string | 是   | 用户唯一标识 |
  | conversation_id  | string | 是   | 会话ID       |
  | prompt           | string | 是   | 用户输入     |
- **响应**：流式返回助手回复内容（text/plain）

### 8.4 获取聊天历史

- **接口路径**：`/api/chat/history/get`
- **方法**：POST
- **功能描述**：获取指定会话的历史记录
- **请求参数**：
  | 字段             | 类型   | 必填 | 说明         |
  |------------------|--------|------|--------------|
  | app_key          | string | 是   | 应用唯一标识 |
  | user_id          | string | 是   | 用户唯一标识 |
  | conversation_id  | string | 是   | 会话ID       |
  | count            | int    | 否   | 返回数量，默认50 |
- **响应参数**：
  | 字段   | 类型     | 说明         |
  |--------|----------|--------------|
  | code   | int      | 状态码       |
  | message| string   | 信息         |
  | data   | array    | 聊天记录列表 |
- **data结构**：
  | 字段       | 类型   | 说明         |
  |------------|--------|--------------|
  | user       | string | 用户输入     |
  | assistant  | string | 助手回复     |
  | timestamp  | int    | 时间戳       |
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [
      {"user": "你好", "assistant": "你好，有什么可以帮您？", "timestamp": 1717800000000}
    ]
  }
  ```

### 8.5 其它相关接口

- **/api/chat/history/add**  
  增加历史对话（需传 conversation_id），一般由后端自动保存，前端无需主动调用。

- **/api/chat/history/getallusers**  
  获取某 app_key 下所有用户的最后一条聊天信息。

---

## 9. 用户模板相关

- **接口路径**：`/api/user_template/update`
- **方法**：POST
- **功能描述**：更新用户模板内容
- **请求参数**：
  | 字段            | 类型   | 必填 | 说明         |
  |-----------------|--------|------|--------------|
  | app_key         | string | 是   | 应用唯一标识 |
  | template_content| string | 是   | 模板内容     |
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
  | data   | object | 模板内容 |
- **响应示例**：
  ```json
  {"code": 200, "message": "模板内容更新成功", "data": {"template_content": "xxx"}}
  ```

- **接口路径**：`/api/user_template/get`
- **方法**：POST
- **功能描述**：获取用户模板内容
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | app_key| string | 是   | 应用唯一标识 |
- **响应参数**：同上

---

## 10. 知识库管理

- **接口路径**：`/api/knowledge_base/upload`
- **方法**：POST（`multipart/form-data`）
- **功能描述**：上传知识库（csv文件）
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | app_key| string | 是   | 应用唯一标识 |
  | file   | file   | 是   | csv文件 |
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
  | data   | object | 上传信息 |
- **响应示例**：
  ```json
  {"code": 200, "message": "上传已开始", "data": {"id": 1, "progress": 0, "status": "处理中"}}
  ```

- **接口路径**：`/api/knowledge_base/list`
- **方法**：POST
- **功能描述**：获取知识库列表
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | app_key| string | 是   | 应用唯一标识 |
- **响应参数**：
  | 字段   | 类型     | 说明         |
  |--------|----------|--------------|
  | code   | int      | 状态码       |
  | data   | object[] | 知识库列表   |
- **响应示例**：
  ```json
  {"code": 200, "data": [{"id": 1, "filename": "kb.csv", "count": 100, "status": "完成", "progress": 100, "created_at": "2024-01-01"}]}
  ```

- **接口路径**：`/api/knowledge_base/detail`
- **方法**：POST
- **功能描述**：获取知识库详情
- **请求参数**：
  | 字段     | 类型   | 必填 | 说明   |
  |----------|--------|------|--------|
  | kb_id    | int    | 是   | 知识库ID |
  | page     | int    | 是   | 页码   |
  | page_size| int    | 是   | 每页数量 |
- **响应参数**：
  | 字段   | 类型     | 说明         |
  |--------|----------|--------------|
  | code   | int      | 状态码       |
  | data   | object   | 详情及总数   |
- **响应示例**：
  ```json
  {"code": 200, "data": {"items": [{"question": "Q1", "answer": "A1"}], "total": 100}}
  ```

- **接口路径**：`/api/knowledge_base/delete`
- **方法**：POST
- **功能描述**：删除知识库
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | app_key| string | 是   | 应用唯一标识 |
  | kb_id  | int    | 是   | 知识库ID |
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | message| string | 信息     |
- **响应示例**：
  ```json
  {"code": 200, "message": "删除成功"}
  ```

- **接口路径**：`/api/knowledge_base/init`
- **方法**：POST
- **功能描述**：初始化知识库
- **请求参数**：
  | 字段      | 类型   | 必填 | 说明   |
  |-----------|--------|------|--------|
  | app_key   | string | 是   | 应用唯一标识 |
  | model_name| string | 否   | 模型名 |
- **响应参数**：同上

- **接口路径**：`/api/knowledge_base/search`
- **方法**：POST
- **功能描述**：知识库检索
- **请求参数**：
  | 字段     | 类型   | 必填 | 说明   |
  |----------|--------|------|--------|
  | app_key  | string | 是   | 应用唯一标识 |
  | question | string | 是   | 问题   |
- **响应参数**：
  | 字段   | 类型     | 说明     |
  |--------|----------|----------|
  | code   | int      | 状态码   |
  | data   | object[] | 检索结果 |
- **响应示例**：
  ```json
  {"code": 200, "data": [{"question": "Q1", "answer": "A1"}]}
  ```

- **接口路径**：`/api/knowledge_base/progress`
- **方法**：POST
- **功能描述**：获取知识库进度
- **请求参数**：
  | 字段   | 类型   | 必填 | 说明   |
  |--------|--------|------|--------|
  | kb_id  | int    | 是   | 知识库ID |
- **响应参数**：
  | 字段   | 类型   | 说明     |
  |--------|--------|----------|
  | code   | int    | 状态码   |
  | data   | object | 进度信息 |
- **响应示例**：
  ```json
  {"code": 200, "data": {"progress": 100, "status": "完成"}}
  ```

---

## 11. 静态资源

- **接口路径**：`/images/<path:filename>`
- **方法**：GET
- **功能描述**：获取头像图片

---

如需补充其他接口或参数细节，请提供相关实现。此文档已尽量详细还原api.py及各Manager的真实接口。 