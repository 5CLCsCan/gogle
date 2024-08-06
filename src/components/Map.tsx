'use client'

import React from 'react'
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { MapCenterType } from '@/types'

interface MapProps {
  center: MapCenterType
  radius: number
}

export default function Map({ center, radius }: MapProps) {
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
      <Marker position={center} />
      <Circle center={center} radius={radius} />
    </MapContainer>
  )
}
