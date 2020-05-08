import { Document, model, Types, Schema } from 'mongoose';
​
interface ModuleType extends Document {
  _id: Types.ObjectId,
  name: string,
  value: number
};
​
const moduleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  }
});
​
export default model<ModuleType>('Module', moduleSchema);
