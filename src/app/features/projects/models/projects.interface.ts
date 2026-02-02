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
export interface ProjectById {
  id: string
  name: string
  overview: string
  brief: string
  results: Result[]
  metrics: Metric[]
  startDate: string
  endDate: string
  imageBefore: string
  imageAfter: string
  gallery: Gallery[]
  city: City
  country: Country
  services: Service[]
  localeComplete: LocaleComplete
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface Result {
  id: string
  sectionTitle: string
  sectionBody: string
}

export interface Metric {
  id: string
  metricTitle: string
  metricNumber: number
  metricCase: any
}

export interface Gallery {
  id: number
  url: string
}

export interface City {
  id: string
  name: string
}

export interface Country {
  id: string
  name: string
}

export interface Service {
  id: string
  name: string
}

export interface LocaleComplete {
  ar: boolean
  en: boolean
}


export interface LocaleComplete {
  ar: boolean
  en: boolean
}
