const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
    },
    {
        toJSON: { virtuals: true },
        timestamps: true,
        collection: "shops",
    }
);

const shop = mongoose.model("shop", shopSchema);

shopSchema.virtual("lamp", {
    ref: "lamp",
    localField: "_id",
    foreignField: "shop",
});

module.exports = shop;