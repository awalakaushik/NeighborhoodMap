var map;
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7413549, lng: -73.9980244},
	  zoom: 13
	});
	console.log("map loads successfully");
	// Apply Knockout Bindings so that the list gets populated after the map loads
	//ko.ApplyBindings(new AppViewModel());
}

// function to handle error while loading the map
function handleMapErrorOnLoad() {
	alert("It looks like there is some problem while loading google maps. Please try to refresh your page and try again!");
}