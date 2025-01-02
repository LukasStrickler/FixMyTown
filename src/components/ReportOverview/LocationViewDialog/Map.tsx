import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { divIcon } from 'leaflet'
import type { Dictionary } from '@/dictionaries/dictionary'

interface MapProps {
    location: {
        lat: number
        lng: number
    }
    address?: string
    dictionary: Dictionary
}

const createCustomIcon = () => {
    const iconHtml = document.createElement('div')
    iconHtml.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="hsl(223 40% 40%)" stroke="hsl(0 0% 100%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`

    return divIcon({
        html: iconHtml.innerHTML,
        className: 'custom-marker-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    })
}

export default function Map({ location, address, dictionary }: MapProps) {
    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
            <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                dragging={false}
                scrollWheelZoom={true}
                touchZoom={true}
                doubleClickZoom={true}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[location.lat, location.lng]}
                    icon={createCustomIcon()}
                >
                    {address && (
                        <Popup minWidth={300}>
                            <div className="space-y-2 p-1">
                                <div className="grid grid-cols-[auto,1fr] gap-x-2 text-sm">
                                    <span className="font-medium">{dictionary.components.locationPicker.info.latitude}:</span>
                                    <span>{location.lat.toFixed(5)}</span>

                                    <span className="font-medium">{dictionary.components.locationPicker.info.longitude}:</span>
                                    <span>{location.lng.toFixed(5)}</span>

                                    <span className="font-medium">{dictionary.components.locationPicker.info.address}:</span>
                                    <span className="break-words">{address}</span>
                                </div>
                            </div>
                        </Popup>
                    )}
                </Marker>
            </MapContainer>
        </div>
    )
} 