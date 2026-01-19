export interface IAboutUsResponse {
  status: string
  message: string
  data: Data
}

export interface Data {
  companyOverview: CompanyOverview
  media: Media
  ceoSpeech: CeoSpeech
  mission: Mission
  vision: Vision
  meta: Meta
  _id: string
  videoUrl: string
  description: string
  __v: number
  awards: Award[]
  services: Service[]
  statistics: any[]
  teamMembers: TeamMember[]
  updatedAt: string
  values: any[]
}

export interface CompanyOverview {
  title: string
  foundingYear: number
  description: string
  companySize: string
  industry: string
  headquarters: string
}

export interface Media {
  galleryImages: any[]
  promotionalVideo: any
  logo: string
  bannerImage: string
}

export interface CeoSpeech {
  title: string
  content: string
  ceoName: string
  ceoPosition: string
  videoUrl: any
  ceoImage: string
}

export interface Mission {
  title: string
  description: string
  icon: string
}

export interface Vision {
  title: string
  description: string
  icon: string
}

export interface Meta {
  seoTitle: any
  seoDescription: any
  keywords: any[]
  isActive: boolean
}

export interface Award {
  title: string
  description: string
  image: any
  dateReceived: string
  issuingOrganization: string
  isActive: boolean
  order: number
  _id: string
}

export interface Service {
  title: string
  description: string
  icon: string
  image: any
  features: string[]
  isActive: boolean
  order: number
  _id: string
}

export interface TeamMember {
  socialLinks: SocialLinks
  name: string
  position: string
  bio: string
  image: any
  email: string
  phone: any
  isActive: boolean
  order: number
  _id: string
}

export interface SocialLinks {
  linkedin: any
  twitter: any
  facebook: any
}
