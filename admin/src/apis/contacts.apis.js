import axiosClient from "../configs/axios.config";

const ContactsApis = {
  getAllContactsMessages: ({ search, sort, page }) => {
    return axiosClient.get(
      `/admin/contacts?page=${page}&sort=${sort}&search=${search}`
    );
  },
  deleteContactMessage: ({ id }) => {
    return axiosClient.delete(`/admin/contacts/${id}`);
  },
};

export default ContactsApis;
