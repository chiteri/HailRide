const express      = require("express"), 
	  middleware   = require("../middleware"),
	  NodeGeocoder = require("node-geocoder"),
	  User 	       = require("../models/user"),
	  RideRequest  = require("../models/rideRequest");

const options = {
	provider: "google",
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
}

const geocoder = NodeGeocoder(options);

var router = express.Router();

// Request for a ride 
router.post("/request", (req, res) => {
    geocoder.geocode(req.body.destination, (err, data) => {
		if (err || !data.length) {
			req.flash("error", "Invalid source address");
			return res.redirect("back");
        }
		
		// Find the customer placing the request
		User.findById(req.body.customer_id, (err, customer) => {
			if (err) {
				console.log(err);
			} else {
				console.log(req.body.source);
				var newRideRequest = new RideRequest({
					from_lat: req.body.source.lat, 
					from_lng: req.body.source.lng, 
					// from_location: req.body.source.location,
					to_lat: data[0].latitude, 
					to_lng: data[0].longitude,
					to_location: data[0].formattedAddress,
					customer: customer
				});

				console.log (newRideRequest);

				// Create a new ride request with the information 
				RideRequest.create(newRideRequest, (err, rideRequest) => {
					if(err) {
						// req.flash("error", "Something went wrong.");
						console.log(err);
						res.status.json({ err: err });
					} else {
						// req.flash("success", "Successfully added request.");
						console.log("SUCCESS!!!");
						res.json({ success: true });
						// res.redirect("/home"); 
					}	   
				});
			}
		});	
		// 
    });

});

module.exports = router;