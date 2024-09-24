import { OpenStreetMapProvider } from "leaflet-geosearch";

const lat = document.querySelector('#lat').value || 40.6555447;
const lng = document.querySelector('#lng').value || 0.4683695;
const address = document.querySelector('#address').value || '';

const map = L.map("mapa").setView([lat, lng], 15);
let marker;

const geocodeService = L.esri.Geocoding.geocodeService();

if (lat && lng) {
	if (marker) {
		map.removeLayer(marker);
	}

	marker = new L.marker([lat, lng], {
		draggable: true,
		autoPan: true,
	})
		.addTo(map)
		.bindPopup(address);

	// Detect marker movement
	marker.on("moveend", function (e) {
		
		marker = e.target;
		const position = marker.getLatLng();
		map.panTo(new L.LatLng(position.lat, position.lng));

		geocodeService.reverse().latlng(position, 15).run(function (error, result2) {
			fillInputs(result2);
			marker.bindPopup(result2.address.LongLabel).openPopup();
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	const searcher = document.querySelector("#formbuscador");
	if (searcher) {
		searcher.addEventListener("input", searchAdress);
	}
});

function searchAdress(e) {
	if (e.target.value.length > 7) {

		if (marker) {
			map.removeLayer(marker);
		}

		const provider = new OpenStreetMapProvider();

		provider.search({ query: e.target.value }).then((result) => {
			geocodeService.reverse().latlng(result[0].bounds[0], 15).run(function (error, result2) {
				fillInputs(result2);

				if (marker) {
					map.removeLayer(marker);
				}

				map.setView(result[0].bounds[0], 15);

				marker = new L.marker(result[0].bounds[0], {
					draggable: true,
					autoPan: true,
				})
					.addTo(map)
					.bindPopup(result[0].label)
					.openPopup();

				// Detect marker movement
				marker.on("moveend", function (e) {
					marker = e.target;
					const position = marker.getLatLng();
					map.panTo(new L.LatLng(position.lat, position.lng));

					geocodeService.reverse().latlng(position, 15).run(function (error, result2) {
						fillInputs(result2);
						marker.bindPopup(result2.address.LongLabel).openPopup();
					});
				});
			});
		});
	}
}

function fillInputs(result) {
	document.querySelector('#address').value = result.address.Address || '';
	document.querySelector('#city').value = result.address.City || '';
	document.querySelector('#state').value = result.address.Region || '';
	document.querySelector('#country').value = result.address.CountryCode || '';
	document.querySelector('#lat').value = result.latlng.lat || '';
	document.querySelector('#lng').value = result.latlng.lng || '';
}
