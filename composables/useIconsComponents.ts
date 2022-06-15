const icons = {
  'Arrow/Down': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Arrow/Down.vue'))),
  'Arrow/Left': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Arrow/Left.vue'))),
  'Arrow/Right': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Arrow/Right.vue'))),
  'Arrow/Up': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Arrow/Up.vue'))),
  Copy: markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Copy.vue'))),
  Cross: markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Cross.vue'))),
  Login: markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Login.vue'))),
  Logout: markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Logout.vue'))),
  'Logo/Discord': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Logo/Discord.vue'))),
  'Logo/Github': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Logo/Github.vue'))),
  'Logo/Twitter': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Logo/Twitter.vue'))),
  'Math/Minus': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Math/Minus.vue'))),
  'Math/Plus': markRaw(defineAsyncComponent(() => import('@/components/utils/icon/set/Math/Plus.vue'))),
}

export type IconsNames = keyof typeof icons
export type IconsComponents = typeof icons[IconsNames]

export const useIconsComponents = (): Record<IconsNames, IconsComponents> => icons
