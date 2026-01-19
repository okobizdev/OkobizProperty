import PartnersApis from "../apis/partners.apis";

const { addPartnerApi, deletePartnerApi, editPartnerApi, getPartnerApi } =
  PartnersApis;

const PartnersServices = {
  processGetPartners: async () => {
    const response = await getPartnerApi();
    return response?.data?.data;
  },
  processAddPartner: async (payload) => {
    const response = await addPartnerApi(payload);
    return response?.data;
  },
  processEditPartner: async (id, payload) => {
    const response = await editPartnerApi(id, payload);
    return response?.data;
  },
  processDeletePartner: async (id) => {
    const response = await deletePartnerApi(id);
    return response?.data;
  },
};

export default PartnersServices;
