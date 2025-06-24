import { formatUserName } from './formatUsername'

export const getUserInitials = (user: any) => {
  const userName = formatUserName(user)?.trim?.()
  const words = userName?.split?.(' ')
  const firstLetter = words?.[0]?.[0]
  const secondLetter = words?.length >= 2 ? words?.at(-1)[0] : ''
  console.log('WORDS', words)
  return `${firstLetter}${secondLetter}`
}
