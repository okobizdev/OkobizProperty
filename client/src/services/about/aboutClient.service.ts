import AboutUsApis from "../../app/apis/aboutUs.apis";




const { getAboutUsApi } = AboutUsApis;

const AboutServices = {
  processGetAboutUs: async () => {
    try {
      const response: any = await getAboutUsApi();
      return response?.data;
    } catch (error) {
      console.error('Error fetching About Us:', error);
      throw error;
    }
  },
};

export default AboutServices;
