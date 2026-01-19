import axiosClient from "../configs/axios.config";

const testimonialApi = {
    getTestimonialsApi: () => {
        return axiosClient.get("/testimonials");
    },
    addTestimonialApi: (payload) => {
        return axiosClient.post("/testimonials", payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    updateTestimonialApi: (id, payload) => {
        return axiosClient.put(`/testimonials/${id}`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    deleteTestimonialApi: (id) => {
        return axiosClient.delete(`/testimonials/${id}`);
    },
};

export default testimonialApi;
