import { Document, model, Types, Schema } from 'mongoose';

interface ModulesType {
  _id: Types.ObjectId,
  name: string,
  value: number
};

interface UserType extends Document {
  _id: Types.ObjectId,
  node_id: string,
  login: string,
  name: string,
  html_url: string,
  avatar_url: string,
  moduleUsed: ModulesType[]
};

const UserSchema = new Schema({
  node_id: {
    type: String,
    required: true,
    unique: true
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  html_url: {
    type: String
  },
  avatar_url: {
    type: String
  },
  moduleUsed: [{
    name: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: Number,
      required: true
    }
  }]
});

export default model<UserType>('User', UserSchema);
