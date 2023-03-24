import { useEffect, useState } from "react";
import "./MapApp.css";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import axios from "axios";

function MapApp() {
    const [address, setAddress] = useState({ streetaddress: "", city: "", postalCode: "" });
    const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
    const [locations, setLocations] = useState<Array<Location>>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }, []);

    function handleInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = ev.target;
        setAddress((prev) => ({ ...prev, [id]: value }));
    }

    async function handleAddMarker() {
        const location: Location = await getLocation(address);

        setLocations(
            (prev) =>
                [...prev, { lat: location.lat, lng: location.lng }] as Array<{
                    lat: number;
                    lng: number;
                }>
        );
    }

    const markers = locations.map((location, index) => (
        <div key={index}>
            <Marker position={location}>
                <Tooltip direction="top" opacity={1} permanent>
                    {calculateDistance(location, userLocation).toString().slice(0, 4)} km
                </Tooltip>
            </Marker>
        </div>
    ));

    return (
        <div className="app">
            <div className="map-container">
                <h1>Karttapiste demo</h1>
                <MapContainer className="map" center={userLocation} zoom={11.4} maxZoom={18}>
                    <CenterMap center={userLocation} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={userLocation}>
                        <Tooltip direction="top" opacity={1} permanent>
                            Olet täällä (?)
                        </Tooltip>
                    </Marker>
                    {markers}
                </MapContainer>
                <div className="add-marker">
                    <h2>Lisää karttapiste</h2>
                    <div className="inputs">
                        <input
                            type="text"
                            id="streetaddress"
                            placeholder="Katuosoite"
                            value={address.streetaddress}
                            onChange={(ev) => handleInputChange(ev)}
                        />
                        <input
                            type="number"
                            id="postalCode"
                            placeholder="Postinumero"
                            value={address.postalCode}
                            onChange={(ev) => handleInputChange(ev)}
                        />
                        <input
                            type="text"
                            id="city"
                            placeholder="Kaupunki"
                            value={address.city}
                            onChange={(ev) => handleInputChange(ev)}
                        />
                    </div>
                    <button className="add-button" style={{ width: "10rem" }} onClick={() => handleAddMarker()}>
                        Lisää
                    </button>
                </div>
                <p className="disclaimer">
                    Pitäis toimia myös pelkällä osoitteella tai pelkällä postinumerolla ja kaupungin nimellä
                </p>
                <div className="footer">
                    Geokoodaus API:
                    <a href="https://www.maanmittauslaitos.fi/geokoodauspalvelu" style={{ marginBottom: "0.1rem" }}>
                        maanmittauslaitos.fi/geokoodauspalvelu
                    </a>
                    <a href="www.github.com/peekois/karttapiste-demo">github/peekois/karttapiste-demo</a>
                </div>
            </div>
        </div>
    );
}

interface Address {
    streetaddress: string;
    postalCode: string;
    city: string;
}

interface Location {
    lat: number;
    lng: number;
}

function CenterMap({ center }: CenterMapProps) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);

    return null;
}

interface CenterMapProps {
    center: Location;
}

async function getLocation(address: Address): Promise<Location> {
    const addressString = address.streetaddress.split(" ").join("%20");
    const searchTerms = `&text=${addressString}%20${address.postalCode}%20${address.city}`;
    const mmlApiUrl =
        "https://avoin-paikkatieto.maanmittauslaitos.fi/geocoding/v2/pelias/search?sources=interpolated-road-addresses&lang=fi";
    const apiKey = "&api-key=" + import.meta.env.VITE_API_KEY;
    const response = await axios.get(mmlApiUrl + apiKey + searchTerms);
    console.log(response.data.features[0].geometry.coordinates);
    const lat = response.data.features[0].geometry.coordinates[1];
    const lng = response.data.features[0].geometry.coordinates[0];
    return { lat: lat, lng: lng };
}

// Haversine formula credit: StackOverflow
function calculateDistance(location1: Location, location2: Location) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(location2.lat - location1.lat);
    const dLon = deg2rad(location2.lng - location1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(location1.lat)) * Math.cos(deg2rad(location2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export default MapApp;
