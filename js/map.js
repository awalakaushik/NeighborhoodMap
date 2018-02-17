var map;
var infowindow;
var bounds;

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	var latitude = 17.3850;
	var longitude = 78.4867;
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: latitude, lng: longitude},
	  zoom: 11
	});
	infowindow = new google.maps.InfoWindow();
	bounds = new google.maps.LatLngBounds();

	// Apply Knockout Bindings so that the list gets populated after the map loads
	ko.applyBindings(new AppViewModel());
}

// function to handle error while loading the map
function handleMapErrorOnLoad() {
	alert("It looks like there is some problem while loading google maps. Please try to refresh your page and try again!");
}
