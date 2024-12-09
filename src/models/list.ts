import mongoose from "mongoose";
const { Schema } = mongoose;

const ListSchema = new Schema({
  name: { type: String, required: true },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "participant",
    },
  ],
});

const ListModel = mongoose.model("list", ListSchema);
export default ListModel;
