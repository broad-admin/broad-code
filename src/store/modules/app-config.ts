import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { AppConfigState } from '@/store/types'
import setting from '@/setting'

export const useAppConfigStore = defineStore(
  'app-config',
  () => {
    const state = reactive<AppConfigState>(setting)

    return {
      ...toRefs(state),
    }
  },
  {
    presist: {
      enable: true,
      resetToState: true,
    },
  }
)
