const icons = {
  'Arrow/Down': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Arrow/Down.vue'))),
  'Arrow/Left': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Arrow/Left.vue'))),
  'Arrow/Right': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Arrow/Right.vue'))),
  'Arrow/Up': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Arrow/Up.vue'))),
  Copy: markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Copy.vue'))),
  Cross: markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Cross.vue'))),
  Dot: markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Dot.vue'))),
  Login: markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Login.vue'))),
  Logout: markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Logout.vue'))),
  'Logo/Discord': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Logo/Discord.vue'))),
  'Logo/Github': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Logo/Github.vue'))),
  'Logo/Icon': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Logo/Icon.vue'))),
  'Logo/Telegram': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Logo/Telegram.vue'))),
  'Logo/Twitter': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Logo/Twitter.vue'))),
  'Math/Minus': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Math/Minus.vue'))),
  'Math/Plus': markRaw(defineAsyncComponent(() => import('@/assets/scripts/icons/Math/Plus.vue'))),
}

export type IconsNames = keyof typeof icons
export type IconsComponents = typeof icons[IconsNames]

export const useIconsComponents = (): Record<IconsNames, IconsComponents> => icons
