const express = require("express");
import reviewController from "../controllers/reviewController";
const router = express.Router();

router.get("/", reviewController.getAllReviews);
router.get("/search/:key", reviewController.searchReview);
router.get("/sort", reviewController.sortReview);
router.post("/", reviewController.createReview);
router.patch("/:id", reviewController.updateReview);
router.put("/delete/:id", reviewController.deleteReview);
router.get("/service/:id", reviewController.getReviewByServiceId);
router.get("/user/:id", reviewController.getReviewByUser);
router.get("/:id", reviewController.getReviewByID);
router.patch("/isGoodReview/:id", reviewController.updateIsGoodReview);

module.exports = router;
