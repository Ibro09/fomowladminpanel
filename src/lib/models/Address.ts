import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
});

// Prevent OverwriteModelError during hot reload
const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);

export default Address;
