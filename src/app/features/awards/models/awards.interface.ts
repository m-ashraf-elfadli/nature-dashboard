export interface Award {
  id: string
  name: string
  description: string
  image: string
  organizationLogos: any[]
  awardDate: string
  status: boolean
  localeComplete: LocaleComplete
  createdAt: string
  updatedAt: string
}

export interface LocaleComplete {
  ar: boolean
  en: boolean
}