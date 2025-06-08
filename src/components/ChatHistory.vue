<template>
  <div class="history-list">
    <!-- 开启新对话按钮 -->
    <div class="new-chat-section">
      <t-button class="new-chat-btn" variant="outline" block @click="$emit('startNewChat')">
          <template #icon>
            <AddIcon />
          </template>
        开启新对话
      </t-button>
    </div>
    <div v-for="(item, idx) in historyList" :key="item.id"
      :class="['history-item', { active: idx === currentChatIndex }]" @click="$emit('selectChat', idx, item.conversation_id)">
      <div class="history-item-content">
        <div class="history-title">{{ item.text }}</div>
        <div class="history-preview">{{ dayjs(item.created_at).format('YY-MM-DD HH:mm:ss') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import dayjs from 'dayjs';
import {
  AddIcon
} from 'tdesign-icons-vue-next';
const props = defineProps({
  historyList: {
    type: Array,
    required: true
  },
  currentChatIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['selectChat', 'startNewChat']);
</script>

<style scoped>
.new-chat-section{
  background:conic-gradient(rgb(0, 195, 255), rgb(76, 235, 27), rgb(0, 98, 255), rgb(160, 124, 243), rgb(0, 195, 255));
  box-shadow: rgba(0, 255, 240, 0.12) 0px 2px 4px -1px, rgba(0, 71, 255, 0.08) 0px 4px 5px, rgba(0, 102, 255, 0.05) 0px 1px 10px;
  border-radius: 10px;
  display: block;
  padding: 1px;
  .new-chat-btn{
    background: #ffffffee;
    border-radius: 10px;
    color:#1890ff;
  }
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 20px 0;
}
.new-chat-section {
  margin-bottom: 20px;
}

.history-item {
  padding: 12px 16px;
  margin: 0 0px 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: #e6f4ff;
}

.history-item.active {
  background: #e6f4ff;
  border-left: 3px solid #1890ff;
}

.history-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-preview {
  font-size: 12px;
  color: #86909c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>