// Foursquare API credentials
const ClientID = "XIAQLFODY15IXHPQQT3O5APHDV1FWW1ILULATZG12DPS2ZDM";
const ClientSecret = "NNI2YCIOKFDSIUXKIBKQK1MJ2B4TLI3UHJ3M2PCEKPGN53LN";
const latitude = 17.3850;
const longitude = 78.4867;
// Foursquare api to search places in hyderabad
foursquare_url = "https://api.foursquare.com/v2/venues/search?ll="+latitude+","+longitude+"&client_id="+ClientID+"&client_secret="+ClientSecret+"&query=temple&limit=10&v=20180217"

// Temple class to hold the data of each temple
var Temple = function(name, lat, lng, address, checkins){
	this.name = name;
	this.lat = lat;
	this.lng = lng;
	this.address = address;
	this.checkins = checkins;
	this.showTemple = true;
};

var AppViewModel = function() {
	var self = this;
	self.templeData = ko.observableArray([]);
	self.markers = ko.observableArray([]);

	//setting current map item to first map marker in the markers array
	self.currentItem = self.markers()[0];

	//Fetch temple data from foursquare api
	self.data = fetchTempleData(foursquare_url);

	// fetch data from foursqaure using JS promises
	self.data.then(function(response){
		self.loadMap(response);
	}).catch(function(error){
		alert("Err! It looks like the data couldn't be fetched from the Foursquare API... Please try again later!");
	});


	// load the map with the markers now
	self.loadMap = function(response){
		// iterate and load temple data to the array
		// load map markers after that
		$.each(response.response.venues, function(index, item){
			var temple = item;
			self.templeData.push(new Temple(
				temple.name,
				temple.location.lat,
				temple.location.lng,
				temple.location.formattedAddress,
				temple.stats.checkinsCount
			));
			//load markers
			var position = {
				lat: parseFloat(temple.location.lat),
				lng: parseFloat(temple.location.lng)
			};
			var title = temple.name;
			var address = temple.location.formattedAddress;
			var checkins = temple.stats.checkinsCount;
			//create marker
			var marker = new google.maps.Marker({
				map: map,
				position: position,
				title:  title,
				animation: google.maps.Animation.DROP,
				address: address,
				checkins: checkins,
				show: ko.observable(temple.show)
			});
			// add each marker to the markers array
			self.markers.push(marker);
			// add event listener for each marker
			marker.addListener('click', function(){
				self.showInfoWindow(marker);
			});
			bounds.extend(marker.position);
		});
		map.fitBounds(bounds);

		// show all map markers
		self.showAllMarkers(map);
	};

	// show all markers function
	self.showAllMarkers = function(map){
		for (var i = 0; i < self.markers().length; i++) {
			self.markers()[i].setVisible(true);
			self.markers()[i].show(true);
		}
	};
	// show info window function
	self.showInfoWindow = function(marker) {
		// Check to make sure the infowindow is not already opened on this marker.
		self.currentMapItem = marker;
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			var infoWindowContent = "<h4>"+self.currentMapItem.title+"</h4><h6>Address: "+self.currentMapItem.address+"<p><em>powered by foursquare</em></p>";
			infowindow.setContent(infoWindowContent);
			infowindow.open(map, marker);
			// Close marker if info window is closed
			infowindow.addListener('closeclick',function(){
				infowindow.setMarker = null;
			});
			self.animateMarker(marker);
		}
	};
	// animate marker function
	self.animateMarker = function(marker){
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ marker.setAnimation(null);}, 2000);
	};

	// Filter Search Code
	// filter input textbox binding
	self.searchTemple = ko.observable('');

	// apply filter on every keydown event
	self.filterTempleData = function() {

		var currentFilter = self.searchTemple();
		infowindow.close();

		//filter the list as user seach
		if (currentFilter.length === 0) {
				self.showAllMarkers(map);
			} else {
				for (var i = 0; i < self.markers().length; i++) {
					// console.log(self.markers().length);
					if (self.markers()[i].title.toLowerCase().indexOf(currentFilter.toLowerCase()) > -1) {
						self.markers()[i].show(true);
						self.markers()[i].setVisible(true);
					} else {
						self.markers()[i].show(false);
						self.markers()[i].setVisible(false);
					}
				}
		}
		infowindow.close();
	};
	// filter search code ends here
};

// JS promise to fetch temple data from foursqaure API
var fetchTempleData = function (url){
	return new Promise(function(resolve, reject){
		$.getJSON(foursquare_url).done(function(response){
			resolve(response);

		}).fail(function(status){
			reject(status);
		});
	});
};

