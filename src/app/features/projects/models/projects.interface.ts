export interface Project {
  id: string
  name: string
  image: string
  cityName: string
  countryName: string
  countryLogo: string
  services: string[]
  localeComplete: LocaleComplete
  status: boolean
}

export interface LocaleComplete {
  ar: boolean
  en: boolean
}
