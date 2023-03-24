import "./App.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

function App() {
    return (
        <div className="map-container">
            <MapContainer className="map" center={[60.183347, 24.939903]} zoom={11.5} maxZoom={18}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </div>
    );
}

export default App;
