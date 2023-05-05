const mongoose = require("mongoose");

const chickenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    varients: [],
    prices: [],
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },

  { timestamps: true }
);

const chickenModel = mongoose.model("chicken", chickenSchema);
module.exports = { chickenModel };
