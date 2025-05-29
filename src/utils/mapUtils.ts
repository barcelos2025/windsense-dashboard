
// Map utility functions and constants

// Get alert level color based on sensor readings
export const getAlertColor = (temperature: number, windSpeed: number): string => {
  // High temperature or wind speed indicates higher alert levels
  if (temperature > 35 || windSpeed > 80) {
    return '#ef4444'; // Red - Critical
  } else if (temperature > 30 || windSpeed > 50) {
    return '#f59e0b'; // Orange - Attention
  } else {
    return '#10b981'; // Green - Normal
  }
};

// Get alert level text
export const getAlertText = (temperature: number, windSpeed: number): string => {
  if (temperature > 35 || windSpeed > 80) {
    return 'Nível Crítico';
  } else if (temperature > 30 || windSpeed > 50) {
    return 'Nível de Atenção';
  } else {
    return 'Nível Normal';
  }
};

// Default map options
export const getDefaultMapOptions = (): google.maps.MapOptions => ({
  center: { lat: -21.5297, lng: -42.6425 }, // Leopoldina, MG, Brazil
  zoom: 13,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212835" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  rotateControl: false,
});

// City markers data
export const CITY_MARKERS = [
  { name: 'Leopoldina', position: { lat: -21.5313, lng: -42.6421 } },
  { name: 'Cataguases', position: { lat: -21.3926, lng: -42.6896 } }
];
