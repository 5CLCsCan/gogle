'use client'

import React from 'react'
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { MapCenterType, Place } from '@/types'
import L from 'leaflet'

interface MapProps {
  center: MapCenterType
  radius: number
  selectedPlaces: Place[]
}

export default function Map({ center, radius, selectedPlaces }: MapProps) {
  console.log(center)

  return (
    <MapContainer
      center={center}
      zoom={16}
      scrollWheelZoom={false}
      className='w-full h-full'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker
        position={center}
        icon={
          new L.Icon({
            iconUrl:
              'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxvY2F0ZS1maXhlZCI+PGxpbmUgeDE9IjIiIHgyPSI1IiB5MT0iMTIiIHkyPSIxMiIvPjxsaW5lIHgxPSIxOSIgeDI9IjIyIiB5MT0iMTIiIHkyPSIxMiIvPjxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMiIgeTI9IjUiLz48bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjE5IiB5Mj0iMjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI3Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjwvc3ZnPg==',
          })
        }
      />
      <Circle center={center} radius={radius} />
      {selectedPlaces.map(place => (
        <Marker
          key={place._id}
          position={{
            lat: place.latitude,
            lng: place.longitude,
          }}
          icon={
            new L.Icon({
              iconUrl:
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1hcC1waW4iPjxwYXRoIGQ9Ik0yMCAxMGMwIDQuOTkzLTUuNTM5IDEwLjE5My03LjM5OSAxMS43OTlhMSAxIDAgMCAxLTEuMjAyIDBDOS41MzkgMjAuMTkzIDQgMTQuOTkzIDQgMTBhOCA4IDAgMCAxIDE2IDAiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIi8+PC9zdmc+',
            })
          }
        />
      ))}
    </MapContainer>
  )
}
