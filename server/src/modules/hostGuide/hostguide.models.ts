
import { IHostGuide } from './hostguide.interface';
import { Schema, model, Model } from 'mongoose';
const HostGuideSchema = new Schema<IHostGuide>(
    {
        title: { type: String, default: null },
        description: { type: String, default: null },
        video: { type: String, required: true },
    },
    { timestamps: true }
);
const HostGuide: Model<IHostGuide> = model<IHostGuide>('HostGuide', HostGuideSchema);
export default HostGuide;


