import axiosClient from "../configs/axios.config";



const HostGuideApi = {
    getHostGuideApi: () => {
        return axiosClient.get(`/get-host-guide-video`);
    },

    addHostGuideApi: (payload) => {
        return axiosClient.post("/admin/create-host-guide-video", payload);
    },
    editHostGuideApi: (id, payload) => {
        return axiosClient.patch(`/admin/edit-host-guide-video/${id}`, payload);
    },
    deleteHostGuideApi: (id) => {
        return axiosClient.delete(`/admin/delete-guided-video/${id}`);
    },

};

export default HostGuideApi;