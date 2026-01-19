import { IHostGuide } from "./hostguide.interface";
import HostGuide from "./hostguide.models";


const HostGuideRepository = {
    createHostGuideVideo: async (payload: IHostGuide): Promise<IHostGuide> => {
        try {
            const hostGuide = new HostGuide(payload);
            return await hostGuide.save();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Create Hosting Guide Video Repository');
        }
    },
    getHostGuideVideo: async (): Promise<IHostGuide | null> => {
        try {
            const result = await HostGuide.findOne();
            // Return null if nothing found so service/controller can respond gracefully
            return result as IHostGuide | null;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Get Hosting Guide Video Repository');
        }
    },
    updateHostGuideVideo: async (hostGuideId: string, payload: IHostGuide): Promise<IHostGuide | null> => {
        try {
            const updatedHostGuide = await HostGuide.findByIdAndUpdate(hostGuideId, payload, { new: true });
            return updatedHostGuide;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Update Hosting Guide Video Repository');
        }
    },
    deleteHostGuideVideo: async (hostGuideId: string): Promise<IHostGuide | null> => {
        try {
            const deletedHostGuide = await HostGuide.findByIdAndDelete(hostGuideId);
            return deletedHostGuide;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Delete Hosting Guide Video Repository');
        }
    },
}
export default HostGuideRepository;