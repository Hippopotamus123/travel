import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  user: mongoose.Types.ObjectId;
  name?: string;
  place: string;
  duration: number;
  createdAt: Date;
  image: string;
  description?: string;
  activities?: string[];
  attractions?: string[];
  foods?: string[];
  packing_list?: string[];
}

const planSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: false },
    place: { type: String, required: true },
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    image: { type: String, required: true },
    description: { type: String, required: false },
    activities: [{ type: String }],
    attractions: [{ type: String }],
    foods: [{ type: String }],
    packing_list: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IPlan>('Plan', planSchema);