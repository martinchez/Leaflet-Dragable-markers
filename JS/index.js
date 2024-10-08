var map = L.map('map').setView([51.505, -0.09], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)

// var marker = L.marker([51.505, -0.09], { draggable: true }).addTo(map)
// parse inhabitants data
var inhabitantsContainer = document.getElementById('inhabitants-container')
var inhabitants = inhabitantsContainer.getElementsByClassName('inhabitant')

// Create a marker cluster group
var markers = L.markerClusterGroup({
  iconCreateFunction: function (cluster) {
    var childCount = cluster.getChildCount()
    var size = Math.min(40, 20 + childCount * 5) // Adjust the circle size based on the number of markers

    return L.divIcon({
      html: '<div class="cluster-circle">' + childCount + '</div>',
      className: 'custom-cluster-icon',
      iconSize: [size, size],
    })
  },
})

// Create markers for each inhabitant
for (var i = 0; i < inhabitants.length; i++) {
  var inhabitant = inhabitants[i]
  var lat = parseFloat(inhabitant.getAttribute('data-lat'))
  var lng = parseFloat(inhabitant.getAttribute('data-lng'))
  var Inhabitantname = inhabitant.textContent

  var divIcon = L.divIcon({
    className: 'custom-div-icon',
    html: inhabitant.outerHTML,
  })
  var marker = L.marker([lat, lng], { icon: divIcon, draggable: true }).addTo(
    map
  )
  // var marker = L.marker([lat, lng], { draggable: true }).addTo(map)
  markers.addLayer(marker)
  // Attach dragend event listener
  marker.on('dragend', function (event) {
    var marker = event.target
    var position = marker.getLatLng()
    marker.setLatLng(new L.LatLng(position.lat, position.lng), {
      draggable: true,
    })
    map.panTo(new L.LatLng(position.lat, position.lng))
  })
  // marker.bindPopup(Inhabitantname)
  // Apply the specified styles to the marker
  // marker._icon.classList.add('inhabitant')
}

map.addLayer(markers)

// Custom CSS for the cluster icon
var customClusterIconStyle = `
.custom-cluster-icon {
  background-color: #38f; /* Customize the color */
  border-radius: 50%; /* Make it circular */
  text-align: center;
  line-height: 1.5;
  font-weight: bold;
  color: white;
}

.cluster-circle {
  padding: 5px;
}

`

var style = document.createElement('style')
style.type = 'text/css'
style.appendChild(document.createTextNode(customClusterIconStyle))
document.head.appendChild(style)
