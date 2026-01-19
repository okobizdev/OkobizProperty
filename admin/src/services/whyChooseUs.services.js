import WhyChooseUsApis from "../apis/whyChooseUS.apis";

const {
  addWhyChooseUsApi,
  deleteWhyChooseUsApi,
  editWhyChooseUsApi,
  getWhyChooseUsApi,
  editWhyChooseUsFieldApi,
} = WhyChooseUsApis;

const WhyChooseUsServices = {
  processGetWhyChooseUs: async () => {
    try {
      const response = await getWhyChooseUsApi();
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processAddWhyChooseUs: async (payload) => {
    try {
      const response = await addWhyChooseUsApi(payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditWhyChooseUs: async (id, payload) => {
    try {
      console.log(id, payload);
      const response = await editWhyChooseUsApi(id, payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditWhyChooseUsField: async (id, payload) => {
    try {
      console.log(id, payload);
      const response = await editWhyChooseUsFieldApi(id, payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processDeleteWhyChooseUs: async (id) => {
    try {
      const response = await deleteWhyChooseUsApi(id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};

export default WhyChooseUsServices;
