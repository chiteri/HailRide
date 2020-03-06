var customer_id = "";
var destination = "";

$(document).ready( () => {
    // Front-end: AJAX side; 
    $('#request-ride').on('click', (event) => {
        customer_id = $("#customer_id").val();

        // Where the customer is heading to
        destination = $('#destination').val();
        // Assuming the customer will be moving from their current location
        var source;
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            // Prepare for the AJAX call
            event.preventDefault();
            navigator.geolocation.getCurrentPosition(findLocation, showError, {timeout:10000, enableHighAccuracy: true}); 
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        } 

    }); 
});

// Success callback
function findLocation(position) {
    const source = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }; 

    // Go ahead and make an AJAX call 
    // console.log(source);

    $.ajax({
        url: '/ride/request',
        method: 'POST',
        data: { 
            customer_id: customer_id,
            source: source,
            destination: destination, 
        }

        }).done((res) => {
            if (res.success) {
            console.log('id from ajax call is', res);
            
            // Display message that the app is searching for the nearest available driver
            $('#request-ride').text("Finding a driver nearby .... ");

            // Disable the button 
            $('#request-ride').prop('disabled', true);
            // window.location.reload();
            } else {
                console.log('error...ajax');
            }
    });
}

// Error callback 
function showError(error) {
    switch(error.code) {
    case error.PERMISSION_DENIED:
        console.log("Permission denied by user.");
        break;
    case error.POSITION_UNAVAILABLE:
        console.log("Location position unavailable.");
        break;
    case error.TIMEOUT:
        console.log("Request timeout.");
        break;
    case error.UNKNOWN_ERROR:
        console.log("Unknown error.");
        break;
    }
    handleLocationError(true, infoWindow, map.getCenter());
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// https://www.googleapis.com/geolocation/v1/geolocate?key=%GOOGLE_LOCATION_SERVICE_API_KEY%