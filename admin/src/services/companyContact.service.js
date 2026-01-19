import CompanyContactsApi from "../apis/companyContactinfo.apis";


const { getContactinfoApi, updateContactInfoApi, CreateContactinfoApi, deleteCompanyContactApi } = CompanyContactsApi

const CompanyContactServices = {
    processGetCompanyContacts: async () => {
        try {
            const response = await getContactinfoApi();
            const contactData = response?.data?.data;
            return contactData ? [contactData] : [];
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetCompanyContacts");
            }
        }
    },
    processUpdateCompanyContacts: async (id, payload) => {
        try {
            const response = await updateContactInfoApi(id, payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processUpdateCompanyContacts");
            }
        }
    },
    processCreateCompanyContacts: async (payload) => {
        try {
            const response = await CreateContactinfoApi(payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processCreateCompanyContacts");
            }
        }
    },
    processDeleteCompanyContacts: async (id) => {
        try {
            const response = await deleteCompanyContactApi(id);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processDeleteCompanyContacts");
            }
        }
    },
};

export default CompanyContactServices;
