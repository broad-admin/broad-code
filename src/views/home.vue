<template>
  <div style="height: 100%">
    <n-layout style="height: 100%">
      <n-layout-header>
        <n-grid x-gap="12" :cols="3">
          <n-gi>
            <div></div>
          </n-gi>
          <n-gi>
            <img src="../assets/logo.png" style="width: 100%; margin: 50px 0" alt="" />
          </n-gi>
          <n-gi>
            <div class="right-over-area">
              <n-space justify="end">
                <n-button strong secondary circle type="default" @click="changSubject">
                  <template #icon>
                    <n-icon>
                      <BugSharp />
                    </n-icon>
                  </template>
                </n-button>
                <n-button strong secondary circle type="success" @click="handleSet">
                  <template #icon>
                    <n-icon>
                      <SettingsOutline />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </div>
          </n-gi>
        </n-grid>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <n-grid :x-gap="12" :y-gap="12" :cols="4" layout-shift-disabled>
          <n-gi>
            <n-card class="length-green" style="width: 70%" closable hoverable>
              <template #header>
                <n-space justify="space-between">
                  <span>📖 历史记录</span>
                </n-space>
              </template>
              <template #default>
                <div
                  v-for="(item, index) in userConfigStore.historyRecord"
                  :key="index"
                  class="history-record"
                  @click="handelHistoryRecord(item)"
                >
                  <n-button type="info" dashed round> {{ item }}</n-button>
                </div>
              </template>
            </n-card>
          </n-gi>
          <n-gi :span="2">
            <Content :get-search="handelHistoryRecord" />
          </n-gi>
          <n-gi>
            <div class="light-green"></div>
          </n-gi>
        </n-grid>
      </n-layout-content>
      <!--      <n-layout-footer>成府路</n-layout-footer>-->
      <div>
        <n-drawer v-model:show="active" :default-width="502" resizable>
          <n-drawer-content closable>
            <template #header> 基础设置</template>
            <template #default>
              <div>
                <n-form :model="userFrom">
                  <n-form-item label="排除关键词" label-width="100px">
                    <n-input
                      v-model:value="userFrom.rule"
                      placeholder="输入关键词，回车生效"
                      @keydown.enter="handleSetRule"
                    />
                  </n-form-item>
                  <n-alert type="warning" style="margin-bottom: 10px"> 暂未开放以下功能</n-alert>
                  <n-form-item label="应用ID" label-width="100px">
                    <n-input v-model:value="userFrom.appKey" placeholder="输入个人申请的应用ID" />
                  </n-form-item>
                  <n-form-item label="应用密钥" label-width="100px">
                    <n-input v-model:value="userFrom.rule" placeholder="输入个人申请的应用密钥" />
                  </n-form-item>
                </n-form>
              </div>
            </template>
            <template #footer>
              <n-button>重置</n-button>
            </template>
          </n-drawer-content>
        </n-drawer>
      </div>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
  import { SettingsOutline, BugSharp } from '@vicons/ionicons5'
  import { useAppConfigStore } from '@/store/modules/app-config'
  import { useUserConfigStore } from '@/store/modules/user-config'
  import { ThemeMode } from '@/store/types'
  import Content from '@/components/layout/content.vue'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const appConfigStore = useAppConfigStore()
  const userConfigStore = useUserConfigStore()
  const active = ref<boolean>(false)
  const userFrom = ref<any>({})
  const router = useRouter()

  function changSubject() {
    appConfigStore.theme =
      appConfigStore.theme === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK
  }

  function handleSet() {
    active.value = true
  }

  function handleSetRule() {
    userConfigStore.addExcludeRule(userFrom.value.rule)
    userFrom.value.rule = ''
  }

  function handelHistoryRecord(item: string) {
    router.push({ path: '/', query: { q: item } })
    return item
  }
</script>

<style scoped>
  .right-over-area {
    margin: 15px 100px;
  }

  .history-record {
    margin: 10px 0;
  }
</style>
