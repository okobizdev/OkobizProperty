import axiosClient from "@/lib/axios.config";
import { ITestimonial } from "@/types/testimonials";

const TestimonialApi = {
  // Get all testimonials
  getTestimonials: () => {
    return axiosClient.get<ITestimonial[]>("/testimonials/featured");
  }
};

export default TestimonialApi;
