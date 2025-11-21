"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Compass, Loader2, Flag, Footprints, LocateFixed, AlertTriangle, Map, Shield, CheckCircle2, Frown, KeyRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { LatLng } from "leaflet";

const MapComponent = dynamic(() => import("@/components/app/map"), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});

interface Location {
  lat: number;
  lng: number;
}

const INITIAL_LOCATION: Location = { lat: 34.0522, lng: -118.2437 }; // LA City Hall

type Mode = "none" | "setHome" | "setDestination" | "setCurrent";

export function LocationFeature() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [homeLocation, setHomeLocation] = useState<Location>(INITIAL_LOCATION);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [mode, setMode] = useState<Mode>("none");
  const [isPersonOnRoute, setIsPersonOnRoute] = useState<boolean | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    // Load saved locations from local storage
    const savedHome = localStorage.getItem("homeLocation");
    if (savedHome) setHomeLocation(JSON.parse(savedHome));
    
    const savedDestination = localStorage.getItem("destinationLocation");
    if (savedDestination) setDestinationLocation(JSON.parse(savedDestination));
    
    const savedCurrent = localStorage.getItem("currentLocation");
    if (savedCurrent) setCurrentLocation(JSON.parse(savedCurrent));
  }, []);

  // Save locations to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("homeLocation", JSON.stringify(homeLocation));
  }, [homeLocation]);
  
  useEffect(() => {
    if (destinationLocation) {
      localStorage.setItem("destinationLocation", JSON.stringify(destinationLocation));
    } else {
        localStorage.removeItem("destinationLocation");
    }
  }, [destinationLocation]);
  
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem("currentLocation", JSON.stringify(currentLocation));
    } else {
        localStorage.removeItem("currentLocation");
    }
  }, [currentLocation]);

  const handleRouteFound = useCallback((coordinates: LatLng[]) => {
    setRouteCoordinates(coordinates);
  }, []);


  const handleMapClick = (location: Location) => {
    switch (mode) {
      case "setHome":
        setHomeLocation(location);
        setMode("none");
        break;
      case "setDestination":
        setDestinationLocation(location);
        setMode("none");
        break;
      case "setCurrent":
        setCurrentLocation(location);
        setMode("none");
        break;
      default:
        break;
    }
  };
  
    const handleFindMyLocation = () => {
    if ("geolocation" in navigator) {
      setIsFindingLocation(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setIsFindingLocation(false);
          toast({
            title: "Location Found",
            description: "Your current location has been set on the map.",
          });
        },
        (error) => {
          setError("Unable to retrieve your location. Please check browser permissions.");
          setIsFindingLocation(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const getAlertInfo = (): { title: string; description: string; icon: React.ReactNode } | null => {
    switch (mode) {
        case "setHome":
            return { title: "Set Home Location", description: "Click on the map to place the Home marker.", icon: <Home className="h-4 w-4 text-primary" /> };
        case "setDestination":
            return { title: "Set Destination", description: "Click on the map to place the Destination marker.", icon: <Flag className="h-4 w-4 text-primary" /> };
        case "setCurrent":
            return { title: "Set Person's Location", description: "Click on the map to place the person's current location marker for simulation.", icon: <Footprints className="h-4 w-4 text-primary" /> };
        default:
            return null;
    }
  }

  const alertInfo = getAlertInfo();

  const safetyStatus = useMemo(() => {
    if (!currentLocation || !destinationLocation || routeCoordinates.length === 0) {
      return null;
    }

    if(isPersonOnRoute) {
        return (
             <Alert variant="default" className="bg-green-100 border-green-300">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
                <AlertTitle className="text-green-800">On Route</AlertTitle>
                <AlertDescription className="text-green-700">
                    The person is on the planned path.
                </AlertDescription>
            </Alert>
        )
    }

     return (
        <Alert variant="destructive">
            <Frown className="h-4 w-4" />
            <AlertTitle>Strayed from Path!</AlertTitle>
            <AlertDescription>
                The person appears to be off the planned route.
            </AlertDescription>
        </Alert>
    );

  }, [currentLocation, destinationLocation, routeCoordinates, isPersonOnRoute])

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><Map className="mr-2"/>Route Planner & Safety Check</CardTitle>
        <CardDescription>
          Define a route and simulate a person's location to check their progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 w-full rounded-lg overflow-hidden border">
          <MapComponent
            homeLocation={homeLocation}
            destinationLocation={destinationLocation}
            currentLocation={currentLocation}
            onMapClick={handleMapClick}
            mode={mode}
            onRouteFound={handleRouteFound}
            onPersonOnRouteStatusChange={setIsPersonOnRoute}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={() => setMode("setHome")} variant={mode === 'setHome' ? 'secondary': 'outline'} className={cn("w-full", mode === 'setHome' && "ring-2 ring-primary")}>
                <Home className="mr-2"/> Set Home
            </Button>
            <Button onClick={() => setMode("setDestination")} variant={mode === 'setDestination' ? 'secondary': 'outline'} className={cn("w-full", mode === 'setDestination' && "ring-2 ring-primary")}>
                <Flag className="mr-2"/> Set Destination
            </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={() => setMode("setCurrent")} variant={mode === 'setCurrent' ? 'secondary': 'outline'} className={cn("w-full", mode === 'setCurrent' && "ring-2 ring-primary")}>
                <Footprints className="mr-2"/> Set Person's Location
            </Button>
             <Button onClick={handleFindMyLocation} variant="outline" className="w-full" disabled={isFindingLocation}>
                {isFindingLocation ? <Loader2 className="mr-2 animate-spin"/> : <LocateFixed className="mr-2"/>}
                Use My Location
            </Button>
        </div>

        {alertInfo && (
            <Alert variant="default" className="bg-primary/10 border-primary/50">
                {alertInfo.icon}
                <AlertTitle>{alertInfo.title}</AlertTitle>
                <AlertDescription>
                    {alertInfo.description}
                </AlertDescription>
            </Alert>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {safetyStatus}
        
      </CardContent>
    </Card>
  );
}
