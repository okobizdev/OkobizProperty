import axiosClient from "@/lib/axios.config";




const AboutUsApis = {
  getAboutUsApi: () => {
    return axiosClient.get("/admin/about_us");
  },

};

export default AboutUsApis;
