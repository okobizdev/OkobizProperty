import adminAboutApis from "../apis/adminAbout.apis";



const { getAboutUsApi, addAboutUsApi, editAboutUsApi, deleteAboutUsApi } =
    adminAboutApis;

const AboutUsServices = {
    processGetAboutUs: async () => {
        try {
            const response = await getAboutUsApi();
            return response?.data?.data;
        } catch (error) {
            console.error('Error fetching About Us:', error);
            throw error;
        }
    },
    processAddAboutUs: async (payload) => {
        try {
            const response = await addAboutUsApi(payload);
            return response?.data;
        } catch (error) {
            console.error('Error creating About Us:', error);
            throw error;
        }
    },
    processEditAboutUs: async (id, payload) => {
        try {
            console.log('Editing About Us:', id, payload);
            const response = await editAboutUsApi(id, payload);
            return response?.data;
        } catch (error) {
            console.error('Error updating About Us:', error);
            throw error;
        }
    },
    processDeleteAboutUs: async (id) => {
        try {
            const response = await deleteAboutUsApi(id);
            return response?.data;
        } catch (error) {
            console.error('Error deleting About Us:', error);
            throw error;
        }
    },






};

export default AboutUsServices;