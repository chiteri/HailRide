const mongoose = require("mongoose");

// Schema setup
const rideRequestSchema = new mongoose.Schema ({
	from_lat: Number,
    from_lng: Number,
    from_location: String,
    to_lat: Number,
    to_lng: Number,
    to_location: String,
	createdAt: {type: Date, default: Date.now},
	customer: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
	]
})

module.exports = mongoose.model("RideRequest", rideRequestSchema );