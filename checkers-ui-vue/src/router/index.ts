import AnalysisPage from '@/pages/AnalysisPage.vue'
import PlayPage from '@/pages/PlayPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const MAIN_PAGE_TITLE = 'WARCABY'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisPage,
      meta: { title: `${MAIN_PAGE_TITLE} - Analizuj` },
    },
    {
      path: '/',
      name: 'play',
      component: PlayPage,
      meta: { title: `${MAIN_PAGE_TITLE} - Graj` },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const pageTitle = to.meta.title as string
  document.title = pageTitle || MAIN_PAGE_TITLE
  next()
})

export default router
