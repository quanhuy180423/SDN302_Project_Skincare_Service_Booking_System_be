import mongoose from "mongoose";
import slugify from "slugify";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["single", "combo"],
    },
    subServices: [
      {
        type: String,
        trim: true,
        default: "",
      },
    ],
    image: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

serviceSchema.pre("save", function (next) {
  this.slug = slugify(this.serviceName, { lower: true });
  next();
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
