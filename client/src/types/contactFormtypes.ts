export interface ContactFormValues {
  firstName: string;
  subject: string;
  email: string;
  phone: string;
  message: string;
  area?: string;
  thana?: string;
  district?: string;
  property_size?: string;
  property_size_unit?: string;
  budget?: string;
}

export interface ContactSubmitResponse {
  status: string;
  message: string;
}
