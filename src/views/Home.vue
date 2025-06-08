<template>
  <div class="home-root">
    <!-- 侧边栏 -->
    <div class="home-aside">
      <div class="aside-logo">EWA</div>
      <div class="aside-menu">
        <t-menu value="home" theme="light" placement="left" style="border:none;background:transparent;">
          <t-menu-item value="home">
            <template #icon><t-icon name="home" /></template>
            首页
          </t-menu-item>
          <t-menu-item value="apps">
            <template #icon><t-icon name="app" /></template>
            应用
          </t-menu-item>
          <t-menu-item value="settings">
            <template #icon><t-icon name="setting" /></template>
            设置
          </t-menu-item>
          <t-menu-item value="help">
            <template #icon><t-icon name="help-circle" /></template>
            帮助
          </t-menu-item>
        </t-menu>
      </div>
      <div class="aside-user">
        <t-avatar size="40px" icon="user" />
      </div>
    </div>
    <!-- 主内容区 -->
    <div class="home-main">
      <div class="main-container">
        <!-- 上方卡片区 -->
        <div class="top-cards">
          <div class="card-deploy card-shadow">
            <div class="deploy-title">我的私有化部署</div>
            <div class="licence-block">
              <div class="licence-title">licence</div>
              <div class="licence-status"><t-tag theme="success">正常</t-tag></div>
              <div class="licence-date">有效期 2025-06-02 00:00:00 至 2026-06-02 00:00:00</div>
            </div>
          </div>
          <div class="card-models card-shadow">
            <div class="models-title">已接入模型</div>
            <ul class="model-list">
              <li>Deepseek-R1:14b</li>
              <li>Nomic-Embed-Text:Latest</li>
              <li>Qwq:32b</li>
            </ul>
          </div>
        </div>
        <!-- 我的应用区 -->
        <div class="apps-title">我的应用</div>
        <div class="apps-list">
          <div class="app-card card-shadow" v-for="i in 2" :key="i">
            <div class="app-card-header">
              <img src="https://tdesign.gtimg.com/site/avatar.jpg" class="app-logo" />
              <div class="app-card-title">test1应用</div>
              <t-tag size="small" theme="default">testkey</t-tag>
              <t-icon name="more" class="app-more" />
            </div>
            <div class="app-card-footer">
              <t-avatar size="20px" icon="user" />
              <span class="app-user">joycexu</span>
              <span class="app-card-date">最近更新于2024-06-02 11:35</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-root {
  display: flex;
  min-height: 100vh;
  background: #f7f8fa;
}
.home-aside {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e7e8e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  position: relative;
  z-index: 10;
}
.aside-logo {
  font-size: 20px;
  font-weight: bold;
  color: #2667ff;
  margin: 24px 0 12px 0;
  letter-spacing: 2px;
  text-align: center;
}
.aside-menu {
  flex: 1;
  width: 100%;
  margin-top: 8px;
  .t-menu {
    border: none;
    background: transparent;
    .t-menu__item {
      justify-content: center;
      padding: 0;
      margin: 8px 0;
      .t-icon {
        font-size: 22px;
      }
      .t-menu__content {
        font-size: 13px;
        margin-top: 2px;
      }
    }
    .t-is-active {
      background: #f2f3f5;
      border-radius: 8px;
    }
  }
}
.aside-user {
  margin: 0 0 18px 0;
}
.home-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}
.main-container {
  width: 1200px;
  max-width: 100vw;
  margin: 0 auto;
  padding-top: 32px;
}
.top-cards {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}
.card-deploy {
  flex: 1.6;
  min-width: 0;
  background: #fff;
  border-radius: 12px;
  padding: 24px 32px 20px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.card-models {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 12px;
  padding: 24px 32px 20px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.card-shadow {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  border: 1px solid #e7e8e9;
}
.deploy-title, .models-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}
.licence-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.licence-title {
  font-weight: 500;
  font-size: 15px;
}
.licence-status {
  margin: 2px 0 0 0;
}
.licence-date {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}
.model-list {
  padding-left: 18px;
  font-size: 13px;
  color: #555;
  margin: 0;
  li {
    margin-bottom: 2px;
    list-style: disc;
  }
}
.apps-title {
  margin: 0 0 18px 2px;
  font-size: 16px;
  font-weight: 600;
}
.apps-list {
  display: flex;
  gap: 20px;
}
.app-card {
  width: 320px;
  background: #fff;
  border-radius: 12px;
  padding: 20px 20px 14px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1.5px solid #e7e8e9;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px 0 rgba(38,103,255,0.08);
    border-color: #2667ff44;
  }
}
.app-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.app-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f5f6fa;
  object-fit: cover;
}
.app-card-title {
  font-weight: 500;
  font-size: 15px;
  margin-left: 2px;
}
.app-more {
  margin-left: auto;
  color: #bfbfbf;
  font-size: 18px;
  cursor: pointer;
}
.app-card-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}
.app-user {
  margin-left: 2px;
}
.app-card-date {
  margin-left: 8px;
  font-size: 12px;
  color: #b0b0b0;
}
</style> 