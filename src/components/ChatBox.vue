<template>
    <div class="chat-box">
        <!-- {{ currentChat.chatList }} -->
      <!-- <t-chat-item
        v-if="!currentChat?.chatList?.length"
        content="没有更多内容了，你可以问我任何问题"
        variant="base"
        role="model-change"
      ></t-chat-item> -->
      <t-chat
        ref="chatRef"
        :clear-history="currentChat?.chatList?.length > 0 && !props.loading"
        :data="chatListFormat || []"
        :is-stream-load="props.isStreamLoad"
        @clear="clearConfirm"
      >
        <div class="no-data">------ 没有更多内容了 ------</div>
        <!-- eslint-disable vue/no-unused-vars -->
        <template #content="{ item, index }">
          <t-chat-reasoning v-if="item.reasoning?.length > 0" expand-icon-placement="right">
            <template #header>
              <t-chat-loading animation="gradient" v-if="props.isStreamLoad && item.content.length === 0" text="思考中..." />
              <div v-else style="display: flex; align-items: center">
                <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px" />
                <span>深度思考过程</span>
              </div>
            </template>
            <t-chat-content v-if="item.reasoning.length > 0" :content="item.reasoning" />
          </t-chat-reasoning>
          <t-chat-content v-if="item.content.length > 0" :content="item.content" />
        </template>
        <template #actions="{ item, index }">
          <t-chat-action
            :content="item.content"
            :operation-btn="['good', 'bad', 'replay', 'copy']"
            @operation="handleOperation"
          />
        </template>
        <template #footer>
          <t-chat-input v-model="query" class="colorinput" :stop-disabled="props.isStreamLoad" @send="onSend" @stop="onStop"> </t-chat-input>
        </template>
      </t-chat>
      <t-button v-show="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
        <div class="to-bottom">
          <ArrowDownIcon />
        </div>
      </t-button>
    </div>
  </template>
  <script setup lang="jsx">
  import { ref, computed, defineEmits, onMounted, onUnmounted } from 'vue';
  import { ArrowDownIcon, CheckCircleIcon} from 'tdesign-icons-vue-next';
  import { MessagePlugin} from 'tdesign-vue-next';
  import dayjs from 'dayjs';
  const props = defineProps({
    currentChat: {
      type: Object,
      default: () => ({
        chatList: []
      }),
    },
    loading: {
      type: Boolean,
      default: false
    },
    isStreamLoad: {
      type: Boolean,
      default: true
    }
  });
  const query = ref('');
  const chatListFormat = computed(() => {
    const chatList = [];
    if (!props.currentChat?.chatList) {
      return [];
    }
    props.currentChat.chatList.forEach(item => {
      if(item.user){
        chatList.push({
          avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
          content: item.user || '',
          role: 'user',
          datetime: dayjs(item.timestamp).format('YY-MM-DD HH:mm:ss') || dayjs().format('YY-MM-DD HH:mm:ss')
        })
      }
      // if(item.assistant || item.reasoning?.length > 0){
        chatList.push({
          avatar: 'http://223.113.240.17:30095/images/moooyy/moooyy.png',
          content: item.assistant || '',
          role: 'assistant',
          datetime: dayjs(item.timestamp).format('YY-MM-DD HH:mm:ss') || dayjs().format('YY-MM-DD HH:mm:ss'),
          reasoning: item.reasoning || '',
          duration: item.duration || ''
        })
      // }
    })
    return chatList.reverse();
  });
  const fetchCancel = ref(null);
  
  const chatRef = ref(null);
  const isShowToBottom = ref(false);

  const emit = defineEmits(['send', 'stop']);
  // 滚动到底部
  const backBottom = () => {
    document.body.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };
  // 是否显示回到底部按钮
  const handleChatScroll = function () {
    const scrollTop = document.body.scrollTop;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.body.clientHeight;
    // 距离底部大于半屏的时候显示按钮
    isShowToBottom.value = (scrollHeight - scrollTop - clientHeight) > (clientHeight / 2);
    // console.log(scrollHeight - scrollTop - clientHeight);
  };
  // 清空消息
  const clearConfirm = function () {
    if (props.currentChat?.chatList) {
      props.currentChat.chatList = [];
    }
  };
  const handleOperation = function (type, options) {
    switch(type){
      case 'good':
        MessagePlugin.success({ content: '点赞了这条消息', duration: 2000 })
        break;
      case 'bad':
        MessagePlugin.error({ content: '踩了这条消息', duration: 2000 })
        break;
      case 'replay':
        MessagePlugin.warning({ content: '重新生成这条消息', duration: 2000 })
        break;
      case 'copy':
        break;
    }
  };
  // 倒序渲染
  const onSend = function (inputValue) {
    backBottom();
    if (props.loading) {
      return;
    }
    if (!inputValue) return;
    emit('send', inputValue);
  }
  const onStop = function () {
    emit('stop');
    // if (fetchCancel.value) {
    //   fetchCancel.value.controller.close();
    // }
  };

  // 监听页面滚动
  onMounted(() => {
    document.body.addEventListener('scroll', handleChatScroll);
  });

  onUnmounted(() => {
    document.body.removeEventListener('scroll', handleChatScroll);
  });
  </script>
  <style lang="less">
  /* 应用滚动条样式 */
  ::-webkit-scrollbar-thumb {
    background-color: var(--td-scrollbar-color);
  }
  ::-webkit-scrollbar-thumb:horizontal:hover {
    background-color: var(--td-scrollbar-hover-color);
  }
  ::-webkit-scrollbar-track {
    background-color: var(--td-scroll-track-color);
  }

  :deep(.t-layout) {
    position: relative;
    height: 100vh;
  }

  :deep(.t-layout__sider) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 100;
    background: #fff;
    border-right: 1px solid var(--td-component-border);
    
    .t-layout__sider-content {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  :deep(.t-layout__content) {
    position: relative;
    margin-left: 240px;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
  }
  :deep(.t-layout__sider-collapsed) ~ .t-layout__content {
    margin-left: 64px;    
    .t-chat__footer {
      left: 64px;
    }
  }
  .no-data{
    margin: 50px auto;
    color: #f4f8fb;
    font: 12px/2 var(--td-font-family);
  }

  div.t-chat__avatar{
    margin:0 10px;
    img.t-chat__avatar-image{
      background: #ffffffcc;
      width: var(--td-comp-size-l);
      height: var(--td-comp-size-l);
    }
  }
  .t-chat--normal .t-chat__detail{
    padding-right:var(--td-comp-margin-l);
  }

  .t-chat__detail-reasoning .t-collapse-panel {
    margin-bottom: var(--td-comp-margin-s);
  }
  .t-chat__content{
    .t-chat__base{
      margin-bottom: 8px;
      padding-left: 2px;
      .t-chat__time{
        color: var(--td-font-gray-4);
      }
    }
  }
  .t-chat__detail{
    background-color: #e6f4ff;
    border-radius: 10px;
    text-align: left;
  }
  .user {
    .t-chat__detail{
      background: #fff;
      border-radius: 20px 20px 5px 20px;
      .t-chat__text pre{
        font-weight: 500 !important;
        color:#213248 !important;
        // font:var(--td-font-body-medium) !important;
      }
    }
    
  }
  .assistant {
    .t-chat__detail{
      background: #cee7fc;
      border-radius: 5px 20px 20px 20px ;
      .t-chat__text pre{
        color: #192a41 !important;
        // font:var(--td-font-body-medium) !important;
      }
    }
    .t-chat__text--assistant{
      color: #192a41 !important;
    }
  }
  .t-chat{
    position: relative;
  }
  .t-chat__list{
    overflow: visible !important;
  }
  .t-chat__message-list{
    overflow: visible !important;
  }
  .t-chat__footer {
    position: fixed !important;
    bottom: 0;
    left: 240px;
    right: 10px;
    z-index: 10;
    padding: 0px 0 10px 0;
    background: #d3e1f5;
    border-radius: 20px 20px 0 0;
    //移动端
    @media screen and (max-width: 768px) {
      padding: 0px 0 20px 0;
      margin-left: 10px;
    }
    
    .t-chat__footer__content{
      margin-top: 0px !important;
    }
  }
  
  .chat-box {
    position: relative;
    display: flex;
    flex-direction: column;
    
    .bottomBtn {
      position: fixed;
      left: 50%;
      margin-left: -20px;
      bottom: 90px;
      padding: 0;
      border: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .to-bottom {
      width: 40px;
      height: 40px;
      border: 1px solid #dcdcdc;
      box-sizing: border-box;
      background: var(--td-bg-color-container);
      border-radius: 50%;
      font-size: 24px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .t-icon {
        font-size: 24px;
      }
    }
  }
  .t-chat__footer__textarea .t-textarea .t-textarea__inner{
    border-radius: 20px !important; 
    border: 2px solid transparent !important;
    background-size: 200% 100%;
    position: relative;
    z-index: 1;
  }

  .colorinput {
    .t-chat__footer__textarea .t-textarea .t-textarea__inner {
      background: 
        linear-gradient(#f8fbfd, #ecf7fb) padding-box,
        repeating-linear-gradient(35deg, #00cdff 6%, #7d5aff 20%, #db5d8d 50%, #4b3ff9 70%, #00cdff 90%) border-box;
      background-size: 200% 100%;
      will-change: background-position;
      transform: translateZ(0);
    }

    .t-chat__footer__textarea .t-textarea .t-textarea__inner.t-is-focused {
      background: 
        linear-gradient(#f8fbfd, #ecf7fb) padding-box,
        repeating-linear-gradient(80deg, #00cdff 2%, #7d5aff 20%, #db5d8d 50%, #4b3ff9 70%, #00cdff 96%) border-box;
      background-size: 200% 100%;
      animation: border-flow 6s linear infinite;
      will-change: background-position;
      transform: translateZ(0);
    }
    .t-chat__footer__textarea__icon{
      z-index: 100;
    }
  }

  @keyframes border-flow{
    0% {
        background-position: 0% 0%;
    }
    100% {
        background-position: 200% 0%;
    }
}

  .model-select {
    display: flex;
    align-items: center;
    .t-select {
      width: 112px;
      height: 32px;
      margin-right: 8px;
      .t-input {
        border-radius: 32px;
        padding: 0 15px;
      }
    }
    .check-box {
      width: 112px;
      height: 32px;
      border-radius: 32px;
      border: 0;
      background: #e7e7e7;
      color: rgba(0, 0, 0, 0.9);
      box-sizing: border-box;
      flex: 0 0 auto;
      .t-button__text {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-left: 4px;
        }
      }
    }
    .check-box.is-active {
      border: 1px solid #d9e1ff;
      background: #f2f3ff;
      color: var(--td-brand-color);
    }
  }
  @media screen and (max-width: 768px) {
    :deep(.t-layout__sider) {
      position: fixed;
      transition: left 0.3s ease;
      
      &.t-layout__sider--visible {
        left: 0;
      }
    }
    
    :deep(.t-layout__content) {
      margin-left: 0;
    }
    
    .t-chat__footer {
      left: 0;
    }
  }

  // 优化输入框性能
  :deep(.t-textarea__inner) {
    backface-visibility: hidden;
    perspective: 1000;
    transform: translateZ(0);
  }
  </style>