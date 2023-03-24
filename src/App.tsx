import { useState } from "react";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import axios from "axios";

function App() {
    const [address, setAddress] = useState({ streetaddress: "", city: "", postalCode: "" });

    function handleInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = ev.target;
        setAddress((prev) => ({ ...prev, [id]: value }));
        console.log(address);
    }

    return (
        <div className="map-container">
            <MapContainer className="map" center={[60.183347, 24.939903]} zoom={11.5} maxZoom={18}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
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
                <button className="add-button" style={{ width: "10rem" }}>
                    Lisää
                </button>
            </div>
        </div>
    );
}

export default App;
