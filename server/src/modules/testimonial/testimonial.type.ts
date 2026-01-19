
interface ITestimonial {
  name: string;
  message?: string;
  videoUrl?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default ITestimonial;