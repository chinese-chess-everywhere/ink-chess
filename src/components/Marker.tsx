import React from 'react'
import { Text } from 'ink'
import { Marker as MarkerType } from '../types/marker.js'

interface MarkerProps {
  marker: MarkerType
}

export const Marker: React.FC<MarkerProps> = ({ marker }) => {
  return (
    <Text color="green">○</Text>
  )
}