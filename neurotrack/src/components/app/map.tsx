"use client";

import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, Marker as LeafletMarker, DivIcon, Routing, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  homeLocation: Location;
  destinationLocation: Location | null;
  currentLocation: Location | null;
  onMapClick?: (location: Location) => void;
  mode: "none" | "setHome" | "setDestination" | "setCurrent";
  onRouteFound?: (coordinates: LatLng[]) => void;
  onPersonOnRouteStatusChange?: (isOnRoute: boolean | null) => void;
}

const ROUTE_TOLERANCE_METERS = 50; // 50 meters tolerance from the route polyline

/**
 * Calculates the shortest distance from a point to a line segment.
 * @param p The point (lat/lng).
 * @param p1 The start of the line segment.
 * @param p2 The end of the line segment.
 * @returns The distance in meters.
 */
function distanceToLineSegment(p: L.LatLng, p1: L.LatLng, p2: L.LatLng): number {
    const p1_p2_dist_sq = p1.distanceTo(p2) ** 2;
    if (p1_p2_dist_sq === 0) return p.distanceTo(p1);
    
    const t = ((p.lat - p1.lat) * (p2.lat - p1.lat) + (p.lng - p1.lng) * (p2.lng - p1.lng)) / p1_p2_dist_sq;
    
    if (t < 0) return p.distanceTo(p1);
    if (t > 1) return p.distanceTo(p2);
    
    const closestPoint = L.latLng(p1.lat + t * (p2.lat - p1.lat), p1.lng + t * (p2.lng - p1.lng));
    
    return p.distanceTo(closestPoint);
}


/**
 * Checks if a point is on a polyline within a certain tolerance.
 * @param polyline The polyline (array of LatLngs).
 * @param point The point to check.
 * @param tolerance The tolerance in meters.
 * @returns True if the point is on the route.
 */
function isPointOnRoute(polyline: LatLng[], point: LatLng, tolerance: number): boolean {
    if (!polyline || polyline.length < 2) {
        return false;
    }
    
    for (let i = 0; i < polyline.length - 1; i++) {
        const start = polyline[i];
        const end = polyline[i + 1];
        
        const distance = distanceToLineSegment(point, start, end);

        if (distance < tolerance) {
            return true;
        }
    }
    
    return false;
}


const createIcon = (color: 'blue' | 'red' | 'green'): DivIcon => {
    const markerHtmlStyles = `
        background-color: ${color};
        width: 1.5rem;
        height: 1.5rem;
        display: block;
        left: -0.75rem;
        top: -0.75rem;
        position: relative;
        border-radius: 1.5rem 1.5rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF;`;

    return L.divIcon({
        className: "custom-leaflet-div-icon",
        iconAnchor: [0, 12],
        labelAnchor: [-3, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
    });
};

const homeIcon = createIcon('blue');
const destinationIcon = createIcon('green');
const currentIcon = createIcon('red');

export default function Map({ homeLocation, destinationLocation, currentLocation, onMapClick, mode, onRouteFound, onPersonOnRouteStatusChange }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const homeMarker = useRef<LeafletMarker | null>(null);
  const destinationMarker = useRef<LeafletMarker | null>(null);
  const currentMarker = useRef<LeafletMarker | null>(null);
  const routingControl = useRef<Routing.Control | null>(null);
  const routeCoordinates = useRef<LatLng[] | null>(null);


  // Initialization and click handler effect
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const container = L.DomUtil.get(mapRef.current);
      if (container && (container as any)._leaflet_id) {
        return;
      }
      
      mapInstance.current = L.map(mapRef.current).setView(
        [homeLocation.lat, homeLocation.lng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

    }
    
    const map = mapInstance.current;
    if (map && onMapClick) {
        const handleClick = (e: L.LeafletMouseEvent) => {
            onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        };
        map.on('click', handleClick);

        return () => {
            map.off('click', handleClick);
        };
    }
    
  }, [onMapClick, homeLocation]);

  // Marker, Route, and view update effect
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    if (mapRef.current) {
      mapRef.current.style.cursor = mode !== 'none' ? 'crosshair' : '';
    }

    // --- Update Home Marker ---
    if (homeLocation) {
        if (!homeMarker.current) {
            homeMarker.current = L.marker([homeLocation.lat, homeLocation.lng], { icon: homeIcon }).addTo(map).bindPopup('Home');
        } else {
            homeMarker.current.setLatLng([homeLocation.lat, homeLocation.lng]);
        }
    }

    // --- Update Destination Marker ---
    if (destinationLocation) {
        if (!destinationMarker.current) {
            destinationMarker.current = L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destinationIcon }).addTo(map).bindPopup('Destination');
        } else {
            destinationMarker.current.setLatLng([destinationLocation.lat, destinationLocation.lng]);
        }
    } else if (destinationMarker.current) {
        destinationMarker.current.remove();
        destinationMarker.current = null;
    }

    // --- Update Current Location Marker ---
    if (currentLocation) {
        if (!currentMarker.current) {
            currentMarker.current = L.marker([currentLocation.lat, currentLocation.lng], { icon: currentIcon }).addTo(map).bindPopup("Person's Location");
        } else {
            currentMarker.current.setLatLng([currentLocation.lat, currentLocation.lng]);
        }
    } else if (currentMarker.current) {
        currentMarker.current.remove();
        currentMarker.current = null;
    }
    
    // --- Update Routing ---
    if (homeLocation && destinationLocation) {
      const waypoints = [
        L.latLng(homeLocation.lat, homeLocation.lng),
        L.latLng(destinationLocation.lat, destinationLocation.lng)
      ];
      if (!routingControl.current) {
        routingControl.current = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: 'hsl(var(--primary))', opacity: 0.8, weight: 6 }]
          }
        }).on('routesfound', (e) => {
            const routes = e.routes;
            if (routes.length > 0) {
                const coords = routes[0].coordinates;
                routeCoordinates.current = coords;
                if (onRouteFound) onRouteFound(coords);
            }
        }).addTo(map);
      } else {
        routingControl.current.setWaypoints(waypoints);
      }
    } else {
      if (routingControl.current) {
        map.removeControl(routingControl.current);
        routingControl.current = null;
        routeCoordinates.current = null;
        if (onRouteFound) onRouteFound([]);
      }
    }

    // --- Check if person is on route ---
    if (currentLocation && routeCoordinates.current && routeCoordinates.current.length > 0) {
      try {
        const personOnRoute = isPointOnRoute(routeCoordinates.current, L.latLng(currentLocation.lat, currentLocation.lng), ROUTE_TOLERANCE_METERS);
         if (onPersonOnRouteStatusChange) onPersonOnRouteStatusChange(personOnRoute);
      } catch (e) {
        console.error("Could not calculate person's route status:", e);
        if (onPersonOnRouteStatusChange) onPersonOnRouteStatusChange(null);
      }
    } else {
        if (onPersonOnRouteStatusChange) onPersonOnRouteStatusChange(null);
    }

    // --- Recenter Map ---
    const center = currentLocation ?? destinationLocation ?? homeLocation;
    if (center && map.getCenter().distanceTo([center.lat, center.lng]) > 10) {
      map.setView([center.lat, center.lng], map.getZoom() || 13);
    }
    
  }, [homeLocation, destinationLocation, currentLocation, mode, onRouteFound, onPersonOnRouteStatusChange]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
