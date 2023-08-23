import { Schema, Document, model } from 'mongoose';

// Define the TileMeta type if not already done.
type TileMeta = {
  // Define your TileMeta properties here.
};

// Define the State interface
interface State extends Document {
  tiles: {
    [id: number]: TileMeta;
  };
  inMotion: boolean;
  hasChanged: boolean;
  byIds: number[];
}

// Create a Mongoose schema for the State
const stateSchema = new Schema<State>({
  tiles: {
    type: Schema.Types.Mixed,
    required: true,
  },
  inMotion: {
    type: Boolean,
    required: true,
  },
  hasChanged: {
    type: Boolean,
    required: true,
  },
  byIds: {
    type: [Number],
    required: true,
  },
});

const StateModel = model<State>('State', stateSchema);

export default StateModel;
