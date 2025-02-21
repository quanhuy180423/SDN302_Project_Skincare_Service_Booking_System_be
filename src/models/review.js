const { Schema, model } = require("mongoose");
const { default: Service } = require("./Service");

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    isGoodReview: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.statics.calcAvgRating = async function (serviceID) {
  const stats = await this.aggregate([
    {
      $match: { service: serviceID },
    },
    {
      $group: {
        _id: "$service",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats?.length > 0) {
    await Service.findByIdAndUpdate(serviceID, {
      rating: stats[0].avgRating,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.service);
});

reviewSchema.plugin(require("./plugin/index"));

const Review = model("Review", reviewSchema);
module.exports = Review;
