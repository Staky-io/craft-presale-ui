import type { NuxtLinkOptions } from '#app'

export type LinkTo =
  | string
  | (
    & {
      query?: Record<string | number, string | number | null | undefined | undefined[]>
      hash?: string
    }
    & (
      | {
        path: string
        name?: never
        params?: never
      }
      | {
        path?: never
        name: string | symbol
        params?: Record<string, string | number | null | undefined | (string | number)[]>
      }
    )
  )

export const useNuxtLink = (options?: NuxtLinkOptions) => {
  const NuxtLink = defineNuxtLink(options || { componentName: 'NuxtLink' })

  return {
    NuxtLink,
  }
}
