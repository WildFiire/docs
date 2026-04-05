declare module 'virtual:new-pages' {
  const paths: string[]
  export default paths
}

declare module 'virtual:last-updates' {
  export interface UpdateCard {
    title: string
    category: string
    tagColor: string
    dotClass: string
    tag1: string
    tag2: string
    link: string
    date: string
    username: string
    avatarUrl: string
    profileUrl: string
    buttonText: string
  }
  const cards: UpdateCard[]
  export default cards
}
