<template>
  <div>
    <n-input
      v-model:value="query"
      @keydown.enter="handelSearch"
      placeholder="请输入翻译的文本"
      size="large"
      style="height: 50px; line-height: 50px"
      round
    >
      <template #prefix>
        <n-icon :component="FlashOutline" size="20" />
      </template>
    </n-input>
    <n-card title="📖 大驼峰" embedded :bordered="false" class="card-man">
      <n-tag
        type="success"
        :data-clipboard-text="toHump(item)"
        v-for="(item, index) in searchData.translation"
        :key="index"
        @click="copy"
      >
        {{ toHump(item) }}
      </n-tag>
    </n-card>
    <n-card title="📖 小驼峰" embedded :bordered="false" class="card-man">
      <n-tag
        type="success"
        v-for="(item, index) in searchData.translation"
        :data-clipboard-text="toSmallHump(item)"
        :key="index"
        @click="copy"
      >
        {{ toSmallHump(item) }}
      </n-tag>
    </n-card>
    <n-card title="📖 大蛇行" embedded :bordered="false" class="card-man">
      <n-tag
        type="success"
        v-for="(item, index) in searchData.translation"
        :data-clipboard-text="toBigSerpent(item)"
        :key="index"
        @click="copy"
      >
        {{ toBigSerpent(item) }}
      </n-tag>
    </n-card>
    <n-card title="📖 小蛇行" embedded :bordered="false" class="card-man">
      <n-tag
        type="success"
        v-for="(item, index) in searchData.translation"
        :data-clipboard-text="toLowercase(item)"
        :key="index"
        @click="copy"
      >
        {{ toLowercase(item) }}
      </n-tag>
    </n-card>
    <n-card title="📖 CSS命名规范" embedded :bordered="false" class="card-man">
      <n-tag
        type="success"
        v-for="(item, index) in searchData.translation"
        :data-clipboard-text="cssSpecif(item)"
        :key="index"
        @click="copy"
      >
        {{ cssSpecif(item) }}
      </n-tag>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps } from 'vue'
  import { getTranslate } from '@/api/modules/youdao'
  import { FlashOutline } from '@vicons/ionicons5'
  import { useUserConfigStore } from '@/store/modules/user-config'
  import crypto from 'js-sha256'
  import { v4 as uuidv4 } from 'uuid'
  import Clipboard from 'clipboard'
  import { useMessage } from 'naive-ui'
  import { useRouter } from 'vue-router'

  const props = defineProps({
    getSearch: {
      type: Function,
      default: (res: string) => {
        console.log(res)
        return ''
      },
    },
  })

  const message = useMessage()
  const router = useRouter()
  const userConfig = useUserConfigStore()
  const query = ref('')
  const searchData = ref<any>({})
  const params: any = {
    q: '',
    appKey: '29e9fe900346dde5',
    curtime: '',
    salt: '',
    from: 'zh-CHS',
    to: 'en',
    sign: '',
    signType: 'v3',
  }

  function handelSearch() {
    params.q = query.value
    params.curtime = Math.round(new Date().getTime() / 1000)
    params.salt = uuidv4()
    params.sign = setSign()
    getTranslate(params).then((res: any) => {
      searchData.value = res
      searchData.value.translation = filterExcUsRule(res.translation)
      userConfig.addHistoryRecord(query.value)
    })
  }

  function setSign() {
    return crypto.sha256(
      params.appKey +
        query.value +
        params.salt +
        params.curtime +
        'tlgBSF2ZSHzPOPm4fN9Y6k7PREdgKOW5'
    )
  }

  // 大驼峰
  function toHump(name: string) {
    return initCapita(
      name.replace(/\s(\w)/g, function (all, letter) {
        return letter.toUpperCase()
      })
    )
  }

  // 小驼峰
  function toSmallHump(name: string) {
    const lastName = lowercaseFirstLetter(name)
    return lastName.replace(/\s(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })
  }

  // 大蛇行
  function toBigSerpent(name: string) {
    return uppercase(
      name.replace(/\s(\w)/g, function (all, letter) {
        return '_' + letter.toUpperCase()
      })
    )
  }

  //小蛇形
  function toLowercase(name: string) {
    return lowercase(
      name.replace(/\s(\w)/g, function (all, letter) {
        return '_' + letter.toUpperCase()
      })
    )
  }

  // CSS命名规范
  function cssSpecif(name: string) {
    return lowercase(
      name.replace(/\s(\w)/g, function (all, letter) {
        return '-' + letter.toUpperCase()
      })
    )
  }

  // 首字母小写
  function lowercaseFirstLetter(name: string) {
    return name.replace(/^./, function (all, letter) {
      return all.toLowerCase()
    })
  }

  // 首字母大写
  function initCapita(name: string) {
    return name.replace(/^./, function (all, letter) {
      return all.toUpperCase()
    })
  }

  // 全部大写
  function uppercase(name: string) {
    return name.replace(/[a-z]/g, function (all, letter) {
      return all.toUpperCase()
    })
  }

  // 全部小写
  function lowercase(name: string) {
    return name.replace(/[A-Z]/g, function (all, letter) {
      return all.toLowerCase()
    })
  }

  // 过滤数据
  function filterExcUsRule(nameList: []) {
    const arr: any = []
    const excUsRule: [] = userConfig.excludeRule || []
    nameList.forEach((index: string) => {
      const a = index.split(' ')
      const b = a.map((item) => {
        let type = true
        excUsRule.forEach((rule) => {
          if (item === rule) {
            type = false
            return
          }
        })
        if (type) return item
        else return
      })
      let c = ''
      b.forEach((item) => {
        if (item) {
          c = c + item + ' '
        }
      })
      arr.push(c)
    })
    return arr
  }

  function copy() {
    const clipboard = new Clipboard('.n-tag')
    clipboard.on('success', (e) => {})
    message.success('复制成功')
  }
</script>

<style scoped>
  .card-man {
    margin-top: 20px;
  }
</style>
