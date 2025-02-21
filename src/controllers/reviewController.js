import { BAD_REQUEST, CREATED, OK } from "../config/response.config";
import catchAsync from "../utils/catchAsync";
import reviewService from "../services/reviewService";
import APIError from "../utils/APIError";

const reviewController = {
  getAllReviews: catchAsync(async (req, res) => {
    const reviews = await reviewService.getAllReviews();

    if (!reviews.length) {
      throw new APIError(404, "No review found");
    }

    return OK(res, "Get all reviews successfully", reviews);
  }),

  createReview: catchAsync(async (req, res) => {
    const { user, service, rating, comment } = req.body;

    const review = await reviewService.createReview({
      ...req.body,
      userID: user,
      serviceID: service,
      rating: rating,
      comment: comment,
    });

    return CREATED(res, "Review created successfully", review);
  }),

  updateReview: catchAsync(async (req, res) => {
    const reviewID = req.params.id;
    const { rating, comment } = req.body;

    const review = await reviewService.updateReview(reviewID, rating, comment);

    return OK(res, "Review updated successfully", review);
  }),

  deleteReview: catchAsync(async (req, res) => {
    const reviewID = req.params.id;

    const review = await reviewService.deleteReview(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    return OK(res, "Review deleted successfully", {});
  }),

  getReviewByServiceId: catchAsync(async (req, res) => {
    const serviceID = req.params.id;

    if (!serviceID) {
      throw new APIError(400, "Service ID is required");
    }

    const reviews = await reviewService.getReviewByServiceId(serviceID);

    if (!reviews.length) {
      throw new APIError(404, "No review found");
    }

    return OK(res, "Get all reviews successfully", reviews);
  }),

  getReviewByUser: catchAsync(async (req, res) => {
    const userID = req.params.id;

    if (!userID) {
      throw new APIError(400, "User ID is required");
    }

    const reviews = await reviewService.getReviewByUser(userID);

    if (!reviews.length) {
      throw new APIError(404, "No review found");
    }

    return OK(res, "Get all reviews successfully", reviews);
  }),

  getReviewByID: catchAsync(async (req, res) => {
    const reviewID = req.params.id;

    if (!reviewID) {
      throw new APIError(400, "Review ID is required");
    }

    const review = await reviewService.getReviewByID(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    return OK(res, "Get review successfully", review);
  }),

  updateIsGoodReview: catchAsync(async (req, res) => {
    const reviewID = req.params.id;

    if (!reviewID) {
      throw new APIError(400, "Review ID is required");
    }

    const review = await reviewService.updateIsGoodReview(reviewID);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    return OK(res, "Review updated successfully", review);
  }),
};

export default reviewController;
