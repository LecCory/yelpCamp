const mongoose = require("mongoose");
const Reviews = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  console.log(doc.reviews.length);
  if (doc) {
    await Reviews.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
