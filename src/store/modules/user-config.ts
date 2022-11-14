import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useUserConfigStore = defineStore(
  'user-config',
  () => {
    const state = reactive<any>({
      historyRecord: [],
      excludeRule: [],
    })

    function addHistoryRecord(query: string) {
      if (!state.historyRecord.includes(query)) {
        state.historyRecord.push(query)
      }
    }

    function addExcludeRule(rule: string) {
      if (!state.excludeRule.includes(rule)) {
        state.excludeRule.push(rule)
      }
    }

    function clearHistoryRecord() {
      state.historyRecord = []
    }

    return {
      ...toRefs(state),
      addHistoryRecord,
      addExcludeRule,
      clearHistoryRecord,
    }
  },
  {
    presist: {
      enable: true,
      resetToState: true,
    },
  }
)
