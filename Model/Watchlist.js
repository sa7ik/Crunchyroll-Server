const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchListSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        Videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video", 
                required: true,
            }
        ],
    },
   
);

module.exports= mongoose.model("WatchList", watchListSchema);

