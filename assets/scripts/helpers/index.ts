type TruncateParams = {
  string: string
  start?: number
  end?: number
}

export const capitalize = (string: string): string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

const truncateString = ({ string, start = 5, end = 5 }: TruncateParams): string => `${string.slice(0, start)}…${string.slice(string.length - end)}`
export const truncate = (args: string | TruncateParams): string => (typeof args === 'string' ? truncateString({ string: args }) : truncateString(args))

export const serializeQuery = (url: string, params: Record<string, string>) => (
  Object.keys(params).length
    ? `${url}?${new URLSearchParams(params).toString()}`
    : url
)
