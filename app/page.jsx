
"use client";

import { useEffect, useState } from "react";

import SideNavBar from "../components/SideNavBar";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import BusinessList from "../components/BusinessList";
import FavoriteList from "../components/FavoriteList";
import MapGoogle from "../components/MapGoogle";
import PlaceInfoBox from "../components/PlaceInfoBox";

import GlobalApi from "../service/GlobalApi";
import { getUserLocation } from "./utils/getUserLocation";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("gas_station");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Get user's GPS location
  useEffect(() => {
    getUserLocation()
      .then((coords) => {
        console.log("USER LOCATION:", coords);
        setUserLocation(coords);
      })
      .catch((error) => {
        console.error("LOCATION ERROR:", error);
      });
  }, []);

  // Search nearby places by category
  const getNearByPlace = async (category, lat, lng) => {
    try {
      setLoading(true);

      console.log("GET PLACES:", category, lat, lng);

      const response = await GlobalApi.getNearByPlace(category, lat, lng);

      console.log("PLACES RESULT:", response.data);

      setPlaces(response.data?.places || []);
    } catch (error) {
      console.error("PLACES ERROR:", error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // Search places by text near the user's GPS location
  const searchPlace = async (text) => {
    if (!userLocation) {
      console.error("GPS location is not available yet");
      return;
    }

    if (!text || !text.trim()) {
      return;
    }

    try {
      setLoading(true);
      setShowFavorites(false);

      console.log("TEXT SEARCH:", text);
      console.log("SEARCH LOCATION:", userLocation);

      const response = await GlobalApi.searchPlace(
        text.trim(),
        userLocation.lat,
        userLocation.lng
      );

      console.log("SEARCH RESULT:", response.data);

      setPlaces(response.data?.places || []);
    } catch (error) {
      console.error("SEARCH ERROR:", error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // Load nearby places when category or location changes
  useEffect(() => {
    if (!userLocation) return;

    getNearByPlace(
      selectedCategory,
      userLocation.lat,
      userLocation.lng
    );
  }, [selectedCategory, userLocation]);

  return (
    <div className="flex">
      <SideNavBar setShowFavorites={setShowFavorites} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-10 mt-10 w-full">
        <div>
          <SearchBar onSearch={searchPlace} />

          {showFavorites ? (
            <FavoriteList />
          ) : (
            <>
              <CategoryList
                setSelectedCategory={setSelectedCategory}
              />

              <BusinessList
                places={places}
                loading={loading}
              />
            </>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Map Area
          </h2>

          <MapGoogle
            userLocation={userLocation}
            places={places}
            selectedCategory={selectedCategory}
          />

          <PlaceInfoBox userLocation={userLocation} />
        </div>
      </div>
    </div>
  );
}
