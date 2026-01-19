import axiosClient from "../configs/axios.config";

const CompanyContactsApi = {
    getContactinfoApi: () => {
        return axiosClient.get("/contactinfo");
    },

    CreateContactinfoApi: (payload) => {
        return axiosClient.post("/contactinfo", payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    updateContactInfoApi: (id, payload) => {
        return axiosClient.put(`/contactinfo/${id}`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },


    deleteCompanyContactApi: (id) => {
        return axiosClient.delete(`/contactinfo/${id}`);
    },
};

export default CompanyContactsApi;