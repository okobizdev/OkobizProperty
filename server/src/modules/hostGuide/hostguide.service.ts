import toYouTubeEmbedUrl from "../../utils/ToYouTubeEmbdedUrl";
import { IHostGuide } from "./hostguide.interface";
import HostGuideRepository from "./hostguide.repository";



const HostGuideService = {
    createHostGuideVideo: async (payload: IHostGuide): Promise<IHostGuide> => {
        try {
            if (!payload.video) {
                throw new Error('Video field is required')
            }

            const embedUrl = toYouTubeEmbedUrl(payload.video as string);
            if (!embedUrl) {
                throw new Error('Only YouTube video URLs are supported. Provide a valid YouTube URL.');
            }
            const toSave: IHostGuide = {
                ...payload,
                video: embedUrl,
            };

            return await HostGuideRepository.createHostGuideVideo(toSave);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Create Hosting Guide Video Service');
        }
    },

    handlegetHostGuideVideo: async (): Promise<IHostGuide | null> => {
        try {
            return await HostGuideRepository.getHostGuideVideo();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Get Hosting Guide Video Service');
        }
    },
    editHostGuideVideo: async (hostGuideId: string, payload: IHostGuide): Promise<IHostGuide | null> => {
        try {
            const existingHostGuide = await HostGuideRepository.getHostGuideVideo();
            if (!existingHostGuide || !existingHostGuide._id || existingHostGuide._id.toString() !== hostGuideId) {
                throw new Error('Host Guide Video not found');
            }
            if (payload.video) {
                const embedUrl = toYouTubeEmbedUrl(payload.video);
                if (!embedUrl) {
                    throw new Error('Only YouTube video URLs are supported. Provide a valid YouTube URL.');
                }
                payload.video = embedUrl;
            }
            const updatedHostGuide = await HostGuideRepository.updateHostGuideVideo(hostGuideId, payload);
            return updatedHostGuide;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Edit Hosting Guide Video Service');
        }
    }
    ,
    deleteHostGuideVideo: async (hostGuideId: string): Promise<IHostGuide | null> => {
        try {
            const existingHostGuide = await HostGuideRepository.getHostGuideVideo();
            if (!existingHostGuide || !existingHostGuide._id || existingHostGuide._id.toString() !== hostGuideId) {
                throw new Error('Host Guide Video not found');
            }
            const deletedHostGuide = await HostGuideRepository.deleteHostGuideVideo(hostGuideId);
            return deletedHostGuide;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown Error Occurred In Delete Hosting Guide Video Service');
        }
    },

}
export default HostGuideService;