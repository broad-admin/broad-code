import { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './staticRoutes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export function useAppRouter(app: App) {
  app.use(router)
}

export default router
