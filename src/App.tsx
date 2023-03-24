import { useEffect, useState } from "react";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import axios from "axios";

function App() {
    const [address, setAddress] = useState({ streetaddress: "", city: "", postalCode: "" });
    const [userLocation, setUserLocation] = useState({ lat: 60.183347, lng: 24.939903 });
    const [locations, setLocations] = useState<Array<Location>>([{ lat: 60.183347, lng: 24.939903 }]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }, []);

    function handleInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = ev.target;
        setAddress((prev) => ({ ...prev, [id]: value }));
        console.log(address);
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

    const markers = locations.map((location, index) => <Marker position={location}></Marker>);

    return (
        <div className="app">
            <p>
                {userLocation.lat}, {userLocation.lng}
            </p>
            <div className="map-container">
                <MapContainer className="map" center={[60.183347, 24.939903]} zoom={11.5} maxZoom={18}>
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

export default App;
