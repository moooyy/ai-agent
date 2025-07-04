<template>
  <div class="chat-app" :class="{ collapsed: !showSidebar, isMobile: isMobile }">
    <!-- 收起时左上角浮动按钮，带渐显动画 -->
    <transition name="fade">
      <button size="s" v-if="!showSidebar" class="sidebar-float-action" @click="toggleSidebar">
        <ChevronRightIcon />
      </button>
    </transition>
    <!-- 左侧历史对话列表 -->
    <aside class="sidebar">
      <div class="assistant-info">
        <div class="assistant-logo">
          <img :src="assistant.avatar_pic" alt="avatar" class="avatar-img" />
        </div>
        <div class="assistant-name">{{ assistant.name }}</div>
        <button v-if="showSidebar" class="assistant-action" @click="toggleSidebar">
          <ChevronLeftIcon />
        </button>
      </div>
      <ChatHistory
        :history-list="historyList"
        :current-chat-index="currentChatIndex"
        @selectChat="selectChat"
        @startNewChat="startNewChat"
      />
    </aside>

    <!-- 右侧聊天主界面 -->
    <main class="chat-main">
      
      <ChatBox 
        :conversation_id="conversation_id"
        :currentChat="currentChat"
        :aicontent="aicontent"
        :loading="loading"
        :isStreamLoad="isStreamLoad"
        @send="sendMessage" 
        @stop="stopMessage"
        :assistantAvatar="assistant.avatar_pic"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon
} from 'tdesign-icons-vue-next';
import ChatHistory from './ChatHistory.vue';
import ChatBox from './ChatBox.vue';
import { getAssistantInfo, getUserAiConfig, getHistoryChat, getSessionList, createSession, chatSSE } from '../api/io';
// 响应式处理
const isMobile = ref(false);
const showSidebar = ref(true);
const user_cancel = ref(false);

// AI模型信息
const aiModel = ref(null);
const app_key = getAppName(window.location)
const assistant = ref({avatar_pic: '/images/avatar.png'});

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    showSidebar.value = false;
  } else {
    showSidebar.value = true;
  }
}

function getClientToken() {
  let token = localStorage.getItem('client_token') || 'jd5ly5e3ncnxjip9ems6sx3krftz93ut';
  if (!token) {
    token = Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    localStorage.setItem('client_token', token);
  }
  return token;
}
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

// 当前对话索引
const currentChatIndex = ref(0);
const conversation_id = ref('');
const aicontent = ref('');
const loading = ref(false)
const isStreamLoad = ref(false);
const currentChat = computed(() => historyList.value[currentChatIndex.value]);
async function startNewChat() {
  const session_id = await createSession();
  const newChat = {
    id: session_id.conversation_id,
    text: '新对话',
    chatList: [],
    created_at: +new Date()
  };
  
  historyList.value.unshift(newChat);
  currentChatIndex.value = 0;
  conversation_id.value = session_id.conversation_id;
  if (isMobile.value) {
    showSidebar.value = false;
  }
}
async function selectChat(index, id) {
  currentChatIndex.value = index;
  conversation_id.value = id;
  if (isMobile.value) {
    showSidebar.value = false;
  }
  // 获取历史聊天记录
  const chatList = await getHistoryChat(id);
  historyList.value[currentChatIndex.value].chatList = chatList;
}

// 历史对话数据
const historyList = ref([
  // {
  //   conversation_id: '1',
  //   created_at: +new Date(),
  //   text: '加载中...',
  //   chatList: []
  // }
]);

async function sendMessage(prompt) {
  loading.value = true;
  isStreamLoad.value = true;
  if (!prompt.trim()) return;
  //添加消息占位
  const msg = {
    assistant: '',
    user: prompt,
    timestamp: +new Date(),
    reasoning: ' '
  }
  
  const chatList = currentChat.value.chatList
  const chatListLen = chatList.length
  chatList.push(msg);

  try {
    const res = await chatSSE(conversation_id.value, prompt);
    if (!res.body) {
      chatList[chatListLen].assistant = `对话出错，请重试。`;
      throw new Error('无流式响应体');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let reasoning = '';
    let assistant = '';
    let done = false;
    let contentDivider = false;
    // 读取流式响应体
    while (!done && !user_cancel.value) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        loading.value = false;
        const chunk = decoder.decode(value, { stream: true });
        //读到chunk包含<think>时, contentDivider=ture reasoning+=chunk, 直到读到</think>时, assistant+=chunk
        if(chunk.includes('<think>')) {
          contentDivider = true;
          reasoning += chunk.split('<think>')[1].trim();
        } else if(chunk.includes('</think>')) {
          contentDivider = false;
          assistant += chunk.split('</think>')[1];
        } else {
          // 2.新方式，不用每次分片截取<think>和</think>，用tag做标识位，区分输出的是reasoning还是assistant
          if(contentDivider) {
            reasoning += chunk
            chatList[chatListLen].reasoning = reasoning;
          } else {
            assistant += chunk;
            chatList[chatListLen].assistant = assistant;
          }
        }
      }
    }
    chatList[chatListLen].reasoning = reasoning.trim();
    loading.value = false;
    isStreamLoad.value = false;
  } catch (e) {
    console.error('对话出错：', e);
    chatList[chatListLen].assistant = `对话出错：${e?.message || e?.toString() || '请重试。'}`;
  }
  // // 获取 app_key
  // const app_key = 'moooyy';
  // const user_id = 'jd5ly5e3ncnxjip9ems6sx3krftz93ut'

  // const body = {
  //   app_key,
  //   user_id,
  //   conversation_id: conversation_id.value,
  //   prompt
  // };

  // try {
  //   const res = await fetch('http://223.113.240.17:30095/api/chat', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   });

  //   if (!res.body) throw new Error('无流式响应体');
    
  //   const reader = res.body.getReader();
  //   const decoder = new TextDecoder('utf-8');
  //   let reasoning = '';
  //   let assistant = '';
  //   let done = false;
  //   let contentDivider = false;
  //   // 读取流式响应体
  //   while (!done) {
  //     const { value, done: doneReading } = await reader.read();
  //     done = doneReading;
  //     if (value) {
  //       loading.value = false;
  //       const chunk = decoder.decode(value, { stream: true });
  //       //读到chunk包含<think>时, contentDivider=ture reasoning+=chunk, 直到读到</think>时, assistant+=chunk
  //       if(chunk.includes('<think>')) {
  //         contentDivider = true;
  //       } else if(chunk.includes('</think>')) {
  //         contentDivider = false;
  //       } else {
  //         // 2.新方式，不用每次分片截取<think>和</think>，用tag做标识位，区分输出的是reasoning还是assistant
  //         if(contentDivider) {
  //           reasoning += chunk;
  //           chatList[chatListLen].reasoning = reasoning;
  //         } else {
  //           assistant += chunk;
  //           chatList[chatListLen].assistant = assistant;
  //         }
  //       }
  //       // 尝试解析返回的数据
  //       // try {//纯文本返回
  //       //   const data = JSON.parse(chunk);
  //         // if (data.reasoning) {
  //         //   reasoning = data.reasoning;
  //         // }
  //         // if (data.content) {
  //         //   content = data.content;
  //         // }
  //       // } catch (e) { //直接输出text内容
          
  //         // 如果不是 JSON 格式，直接更新 content
  //         //1.保留原处理方式，每次切分字符串
  //         // if (fullContent.includes('<think>')) {
  //         //   //如果fullContent包含<think> 则更新reasoning,直到</think>
  //         //   chatList[chatListLen].reasoning =  fullContent.split('<think>')[1].split('</think>')[0];
  //         //   //fullContent在</think>之外的内容更新到aicontent
  //         //   chatList[chatListLen].assistant = fullContent.split('</think>')[1];
  //         // }
  //       // }
  //     }
  //   }
  //   isStreamLoad.value = false;
  // } catch (e) {
  //   console.error('对话出错：', e);
  //   chatList[chatListLen].assistant = `对话出错：${e?.message || e?.toString() || '请重试。'}`;
  // }
}

function stopMessage() {
  // console.log('stop');
  const chatList = currentChat.value.chatList;
  const chatListLen = chatList.length;
  chatList[chatListLen-1].assistant = '！用户手动取消！';
  user_cancel.value = true;
  loading.value = false;
  isStreamLoad.value = false;
}

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  // 获取AI模型信息
  try {
    aiModel.value = await getUserAiConfig();
    assistant.value = await getAssistantInfo();
    assistant.value.avatar_pic = `/images/${app_key}/${assistant.value.icon}`;
    const sessions = await getSessionList();
    if (sessions && sessions.length > 0) {
      historyList.value = sessions;
      //初始化第一个列表的会话
      conversation_id.value = historyList.value[0].conversation_id;
      const chatList = await getHistoryChat(historyList.value[0].conversation_id);
      historyList.value[0].chatList = chatList;
    } else {
      // 如果没有会话，创建一个新的
      await startNewChat();
    }
  } catch (e) {
    aiModel.value = null;
    // 可选：错误处理
    console.error('获取AI模型信息失败', e);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style lang="less" scoped>
.chat-app {
  display: flex;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.isMobile{
  .sidebar{
    background-color: #ffffffee;
  }
  .chat-main{
    padding: 20px 20px 0 15px;
  }
}
.sidebar {
  width: 220px;
  background: #ffffff88;
  border-right: 1px solid #e7e8e9;
  display: flex;
  position: fixed;
  flex-direction: column;
  z-index: 100;
  height: 100vh;
  transition: transform 0.3s ease;
}

.assistant-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 8px 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}
.assistant-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
  .avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #f5f6fa;
    object-fit: cover;
  }
  .assistant-brand {
    font-size: 12px;
    color: #219653;
    font-weight: bold;
    margin-top: 2px;
    letter-spacing: 1px;
  }
}
.assistant-name {
  font-size: 17px;
  font-weight: 600;
  color: #222;
  flex: 1;
  text-align: left;
}
.assistant-action {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 12px;
  &:hover {
    background: #f5f6fa;
  }
  svg {
    font-size: 20px;
    color: #888;
  }
}

.chat-main{
  padding: 10px 20px 0 240px;
  min-width: 375px;
  flex: 1;
  transition: padding 0.3s ease;
}

.collapsed {
  .sidebar{
    transform: translateX(-100%);
  }
  .chat-main{
    padding: 20px 20px 0 15px;
  }
  :deep(.t-chat__footer){
    left: 20px;
    right: 20px;
  }
}

.sidebar-float-action {
  position: fixed;
  top: 15px;
  left: 8px;
  z-index: 200;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
  transition: background 0.2s;
  &:hover {
    background: #f5f6fa;
  }
  svg {
    font-size: 20px;
    color: #888;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style> 