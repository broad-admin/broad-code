<template>
  <div>
    <n-input
      v-model:value="query"
      @keyup.enter="handelSearch"
      placeholder="请输入翻译的文本"
      size="large"
      ref="queryInputRef"
      autofocus
      style="height: 50px; line-height: 50px"
      round
    >
      <template #prefix>
        <n-icon :component="FlashOutline" size="20" @click="handelSearch" />
      </template>
    </n-input>
    <n-card title="📖 大驼峰" embedded :bordered="false" class="card-man">
      <n-tag type="info" v-for="(item, index) in searchData.translation" :key="index" @click="copy">
        <p :data-clipboard-text="toHump(item)">{{ toHump(item) }}</p>
      </n-tag>
    </n-card>
    <n-card title="📖 小驼峰" embedded :bordered="false" class="card-man">
      <n-tag type="info" v-for="(item, index) in searchData.translation" :key="index" @click="copy">
        <p :data-clipboard-text="toSmallHump(item)">{{ toSmallHump(item) }}</p>
      </n-tag>
    </n-card>
    <n-card title="📖 大蛇行" embedded :bordered="false" class="card-man">
      <n-tag type="info" v-for="(item, index) in searchData.translation" :key="index" @click="copy">
        <p :data-clipboard-text="toBigSerpent(item)">{{ toBigSerpent(item) }}</p>
      </n-tag>
    </n-card>
    <n-card title="📖 小蛇行" embedded :bordered="false" class="card-man">
      <n-tag type="info" v-for="(item, index) in searchData.translation" :key="index" @click="copy">
        <p :data-clipboard-text="toLowercase(item)">{{ toLowercase(item) }}</p>
      </n-tag>
    </n-card>
    <n-card title="📖 CSS命名" embedded :bordered="false" class="card-man">
      <n-tag type="info" v-for="(item, index) in searchData.translation" :key="index" @click="copy">
        <p :data-clipboard-text="cssSpecif(item)">{{ cssSpecif(item) }}</p>
      </n-tag>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps, watch, onMounted } from 'vue'
  import { getTranslate } from '@/api/modules/youdao'
  import { FlashOutline } from '@vicons/ionicons5'
  import { useUserConfigStore } from '@/store/modules/user-config'
  import crypto from 'js-sha256'
  import { v4 as uuidv4 } from 'uuid'
  import Clipboard from 'clipboard'
  import { useMessage, useLoadingBar } from 'naive-ui'

  const props = defineProps<{
    getSearch: any
  }>()

  const queryInputRef = ref<any>(null)
  const message = useMessage()
  const userConfig = useUserConfigStore()
  const loadingBar = useLoadingBar()
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

  watch(
    () => props.getSearch,
    (val) => {
      if (val) {
        query.value = val
        handelSearch()
      }
    }
  )

  function handelSearch() {
    loadingBar.start()
    params.q = query.value
    params.curtime = Math.round(new Date().getTime() / 1000)
    params.salt = uuidv4()
    params.sign = setSign()
    getTranslate(params).then((res: any) => {
      if (res.errorCode === '0') {
        searchData.value = res
        if (res.web && res.web.length > 0) {
          res.web.forEach((item: any) => {
            res.translation.push(...item.value)
          })
        }
        searchData.value.translation = filterExcUsRule(res.translation)
        userConfig.addHistoryRecord(query.value)
        loadingBar.finish()
      } else {
        message.error('翻译失败，请稍后再试！')
        loadingBar.error()
      }
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
    return name.replace(/^./, function (all) {
      return all.toLowerCase()
    })
  }

  // 首字母大写
  function initCapita(name: string) {
    return name.replace(/^./, function (all) {
      return all.toUpperCase()
    })
  }

  // 全部大写
  function uppercase(name: string) {
    return name.replace(/[a-z]/g, function (all) {
      return all.toUpperCase()
    })
  }

  // 全部小写
  function lowercase(name: string) {
    return name.replace(/[A-Z]/g, function (all) {
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
    const clipboard = new Clipboard('p', {
      text: () => {
        // 过滤空格
        return searchData.value.translation[0].trim()
      },
    })
    clipboard.on('success', (e) => {})
    message.success('复制成功')
  }

  onMounted(() => {
    document.onkeydown = function (e) {
      if (e.key === 'Control') {
        queryInputRef.value.focus()
      }
    }
  })
</script>

<style scoped>
  .card-man {
    margin-top: 20px;
  }

  .n-tag {
    cursor: pointer;
    margin: 0 10px 10px 0;
  }
</style>
