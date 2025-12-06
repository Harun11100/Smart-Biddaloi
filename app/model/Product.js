import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
     
    },
    image: {
      type: String,
      required: true, // URL of the product image
    },
    link: {
      type: String,
      required: true, // product page or external link
    },
   title: {
  type: String,
  enum: [
    "Most Trending",
    "Popular",
    "New Arrival",
    "Best Seller",
    "Featured",
    "Top Rated",
    "Limited Stock",
    "Flash Sale",
    "Recommended",
    "Editor's Choice",
    "Premium",
    "Hot Deal",
    "Today’s Pick",
    "Clearance",
    "Special Offer"
  ],
  default: "New Arrival",
},

  },
  { timestamps: true } // adds createdAt and updatedAt
);

// ✅ Prevent model overwrite in Next.js or hot reload

delete mongoose.models.Product;




export default mongoose.models.Product || mongoose.model("Product", productSchema);
