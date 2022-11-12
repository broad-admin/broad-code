<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-notification-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { darkTheme, zhCN, dateZhCN } from 'naive-ui'
  import { useAppConfigStore } from '@/store/modules/app-config'
  import { ThemeMode } from '@/store/types'

  const appConfigStore = useAppConfigStore()
  const theme = computed(() => (appConfigStore.theme === ThemeMode.DARK ? darkTheme : null))
  const themeOverrides = computed(() => {
    return {
      common: {
        primaryColor: appConfigStore.themeColor,
        primaryColorHover: appConfigStore.themeColor,
        primaryColorPressed: appConfigStore.themeColorPressed,
      },
    }
  })
</script>

<style scoped></style>
