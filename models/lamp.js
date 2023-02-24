const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lampSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        brand: { type: String, required: true, trim: true },
        price: { type: Number, required: true, trim: true, default: 0 },
        shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        detail: {
            stock: { type: Number, default: 0 },
            type: { type: String, required: true, trim: true },
        },
    },
    {
        toJSON: { virtuals: true },
        timestamps: true,
        collection: "lamps",
    }
);
const lamp = mongoose.model("lamp", lampSchema);

module.exports = lamp;