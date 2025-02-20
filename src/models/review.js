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
      $match: { course: serviceID },
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
      ratingsAverage: stats[0].avgRating,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.service);
});

reviewSchema.plugin(require("./plugins/paginate.plugin"));

const Review = model("Review", reviewSchema);
module.exports = Review;
