import axios from 'axios';

const baseURL = 'http://223.113.240.17:30095/api';
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// 获取app_key: url最后一截path
function getAppName(urlString, decode = true) {
  try {
      const url = new URL(urlString);
      const path = url.pathname;
      const regex = /\/app\/([^/]+)(?:\/|$)/;
      const match = path.match(regex);
      
      if (!match) return '';
      
      // 返回原始值或解码后的值
      return decode ? decodeURIComponent(match[1]) : match[1];
  } catch (error) {
      console.error('URL 解析失败:', error);
      return '';
  }
}

//获取/设置 user_id
function getClientToken() {
  let token = localStorage.getItem('client_token');
  if (!token) {
    token = Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    localStorage.setItem('client_token', token);
  }
  return token;
}

const app_key = getAppName(window.location) || 'moooyy'; // 测试号
const user_id = getClientToken() || 'jd5ly5e3ncnxjip9ems6sx3krftz93ut'; // 测试号

// 通用请求方法
export function request(config) {
  return instance(config)
    .then(res => res.data.data)
    .catch(err => {
      // 可根据需要统一处理错误
      throw err;
    });
}

// 获取助手信息
export function getAssistantInfo() {
  return request({
    url: '/assistant/get',
    method: 'post',
    data: { app_key: app_key },
  });
}

// 获取用户AI配置
export function getUserAiConfig() {
  return request({
    url: '/user_ai_config/get',
    method: 'post',
    data: { app_key: app_key },
  });
}

// 获取会话列表
export function getSessionList() {
  return request({
    url: '/conversation/list',
    method: 'post',
    data: { app_key: app_key, user_id: user_id },
  });
}

// 创建会话
export function createSession() {
  return request({
    url: '/conversation/create_id',
    method: 'post',
    data: { app_key: app_key, user_id: user_id },
  });
}

//获取历史聊天记录
export function getHistoryChat(conversation_id) {
  return request({
    url: '/chat/history/get',
    method: 'post',
    data: { app_key: app_key, user_id: user_id, conversation_id },
  });
}


export async function chatSSE(conversation_id, prompt) {
  const body = {
    app_key: app_key,
    user_id: user_id,
    conversation_id: conversation_id,
    prompt: prompt
  };
  return fetch(baseURL+'/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}