import Review from "../models/Review";
import Service from "../models/Service";
import User from "../models/User";
import APIError from "../utils/APIError";

const reviewService = {
  getAllReviews: async () => {
    const reviews = await Review.find()
      .populate("user")
      .populate("service")
      .exec();

    if (!reviews) {
      throw new APIError(404, "No review found");
    }

    return reviews;
  },

  createReview: async ({
    userID,
    serviceID,
    rating,
    comment,
    isGoodReview,
  }) => {
    const user = await User.findById(userID);

    if (!user) {
      throw new APIError(400, "Invalid user ID");
    }

    const service = await Service.findById(serviceID);

    if (!serviceID) {
      throw new APIError(400, "Invalid service ID");
    }

    if (rating < 1 || rating > 5) {
      throw new APIError(400, "Rating must be between 1 and 5");
    }

    if (!comment || comment.trim().length === 0) {
      throw new APIError(400, "Comment is required");
    }

    const review = new Review({
      user: userID,
      service: serviceID,
      rating,
      comment,
      isGoodReview: isGoodReview || false,
    });

    await review.save();

    return review;
  },

  updateReview: async (reviewID, rating, comment) => {
    const review = await Review.findById(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    return review;
  },

  deleteReview: async (reviewID) => {
    const review = await Review.findById(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    await Review.deleteOne({ _id: reviewID });

    return review;
  },

  getReviewByServiceId: async (serviceID) => {
    const service = await Service.findById(serviceID);

    if (!service) {
      throw new APIError(404, "Service not found");
    }

    const reviews = await Review.find({ service: serviceID })
      .populate("user")
      .populate("service")
      .exec();

    return reviews;
  },

  getReviewByUser: async (userID) => {
    const user = await User.findById(userID);

    if (!user) {
      throw new APIError(404, "User not found");
    }

    const reviews = await Review.find({ user: userID })
      .populate("user")
      .populate("service")
      .exec();

    return reviews;
  },

  getGoodReviewByService: async (serviceID) => {
    const service = await Service.findById(serviceID);

    if (!service) {
      throw new APIError(404, "Service not found");
    }

    const reviews = await Review.find({
      service: serviceID,
      isGoodReview: true,
    })
      .populate("user")
      .populate("service")
      .exec();

    return reviews;
  },

  getReviewByID: async (reviewID) => {
    const review = await Review.findById(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    return review;
  },

  updateIsGoodReview: async (reviewID) => {
    const review = await Review.findById(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    review.isGoodReview = !review.isGoodReview;

    await review.save();

    return review;
  },
};

export default reviewService;
