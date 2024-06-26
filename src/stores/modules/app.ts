import { useFullscreen } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { Size } from '@arco-design/web-vue'
import type { theme_list } from '@/hooks'
import { useDynamicTitle } from '@/hooks'

interface AppStore {
  sideBar: {
    isCollapse: boolean
  }
  device: {
    isMobile: boolean
  }
  app: {
    title: string
    animation: string
    titleI18n?: string
    size: Size
    dynamicTitle: boolean
    isDark: boolean | 'auto' | undefined
    theme: (typeof theme_list)[number]
    lang: string
    navBar: boolean
    tabBar: boolean
    isScreenOut: boolean
    isFullscreen: boolean
    openSettingDrawer: boolean
    isLocked: boolean
    LockedTime: number
  }
}

const { isFullscreen, toggle } = useFullscreen()

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    sideBar: {
      isCollapse: false,
    },
    device: {
      isMobile: false,
    },
    app: {
      title: '',
      animation: 'fade-transform',
      size: 'small',
      dynamicTitle: true,
      isDark: undefined,
      theme: 'system',
      lang: 'zh-CN',
      navBar: true,
      tabBar: true,
      isScreenOut: false,
      isFullscreen: false,
      openSettingDrawer: false,
      isLocked: false,
      LockedTime: 5 * 60 * 1000, // 300秒 5分钟自动锁屏
    },
  }),
  persist: {
    paths: ['sideBar', 'device', 'app'],
  },
  actions: {
    toggleSideBar(isMobile?: boolean) {
      this.sideBar.isCollapse = isMobile || !this.sideBar.isCollapse
    },
    setIsMobile(isMobile: boolean) {
      this.device.isMobile = isMobile
    },
    setThemeColor(color: string) {
      this.app.isDark = color === 'dark'
      this.app.theme = color
    },
    setNavBar(navBarStatus: boolean) {
      this.app.navBar = navBarStatus
    },
    setTabBar(tabBarStatus: boolean) {
      this.app.tabBar = tabBarStatus
    },
    setSideBar(sideBarStatus: boolean) {
      this.sideBar.isCollapse = sideBarStatus
    },
    setAppTitle(title: string, i18nStr: string) {
      this.app.title = title
      this.app.titleI18n = i18nStr
      useDynamicTitle().setDynamicTitle()
    },
    toggleScreenOut() {
      this.app.isScreenOut = !this.app.isScreenOut
      this.setSideBar(this.app.isScreenOut)
      this.setNavBar(!this.app.isScreenOut)
    },
    toggleFullScreen() {
      this.app.isFullscreen = !this.app.isFullscreen
      isFullscreen.value = !this.app.isFullscreen
      toggle()
    },
    setDynamicTitle(dynamicTitle: boolean) {
      this.app.dynamicTitle = dynamicTitle
    },
    setAppSize(size: Size) {
      this.app.size = size
    },
    setAppSettingDrawer(v: boolean) {
      this.app.openSettingDrawer = v
    },
    setLang(v: string) {
      this.app.lang = v
    },
    setAnimation(v: string) {
      this.app.animation = v
    },
    setIsLocked(v: boolean) {
      this.app.isLocked = v
    },
    setLockedTime(v: number) {
      this.app.LockedTime = v
    },
  },
})
