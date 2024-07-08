// env variable cant be access in public / js file ->
// for that now we have to run a script through ejs file and save them.
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // style: "mapbox://styles/mapbox/streets-v12",
    // starting position [lng, lat]. Note that lat must be set between -90 and 90
    center: listing.geometry.coordinates, 
    zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:'red', })
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)) // add popup
.addTo(map);
// listing.geometry.coordinates
// we cant access this directly in public/js/map.js 
// so we need to shift these coordinate through ejs.



