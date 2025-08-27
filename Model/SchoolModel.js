import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [255, "Name cannot exceed 255 characters"]
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, "Address must be at least 5 characters long"],
    maxlength: [500, "Address cannot exceed 500 characters"]
  },
  latitude: {
    type: Number,
    required: true,
    min: [-90, "Latitude must be greater than or equal to -90"],
    max: [90, "Latitude must be less than or equal to 90"]
  },
  longitude: {
    type: Number,
    required: true,
    min: [-180, "Longitude must be greater than or equal to -180"],
    max: [180, "Longitude must be less than or equal to 180"]
  }
});

export default mongoose.model("School", schoolSchema);
