'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default marker icon
const icon = L.icon({
    iconUrl: '/marker-icon.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

interface MapProps {
    latitude: number;
    longitude: number;
    address: string;
}

export default function Map({ latitude, longitude, address }: MapProps) {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[latitude, longitude]} icon={icon}>
                <Popup>{address}</Popup>
            </Marker>
        </MapContainer>
    );
}
