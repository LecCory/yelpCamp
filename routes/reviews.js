const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ObjectID = require("mongodb").ObjectID;
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(
      id,
      { $pull: { review: reviewId } },
      { useFindAndModify: false }
    );
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Comment deleted");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
