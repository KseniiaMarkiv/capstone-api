(function() {
    "use strict";

    angular
        .module("spa-demo.geoloc")
        .service("spa-demo.geoloc.geocoder", Geocoder);

    Geocoder.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

    function Geocoder($resource, APP_CONFIG) {
        var addresses = $resource(APP_CONFIG.server_url + "/api/geocoder/addresses", {}, { get: { cache: true } }); // give us minus 1 request, cuz of caching 
        var positions = $resource(APP_CONFIG.server_url + "/api/geocoder/positions", {}, { get: { cache: true } }); // when we already saw this place
        var service = this;
        service.getLocationByAddress = getLocationByAddress;
        service.getLocationByPosition = getLocationByPosition;

        return;
        ////////////////

        //returns location information for a provided address
        function getLocationByAddress(address) {
            var result = addresses.get({ address: address });
            console.log("locateByAddress=", result);
            return result;
        }

        //returns location information for a specific {lng,lat} position
        function getLocationByPosition(position) {
            console.log("locationByPosition", this, position);
            var result = positions.get({ lng: position.lng, lat: position.lat });
            console.log("locateByPosition=", result);
            return result;
        }
    }
})();