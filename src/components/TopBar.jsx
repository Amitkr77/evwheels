"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Mail,
  MapPin,
  Phone,
  UserCircle,
  ShoppingCart,
  Heart,
} from "lucide-react";

export default function TopBar() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const requestLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null);
          setIsLoading(false);
        },
        (err) => {
          setError(
            "Unable to retrieve location. Please allow location access."
          );
          setIsLoading(false);
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (location) {
      const fetchAddress = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data.address) {
            const { county, state, country, postcode, state_district } =
              data.address;
            setAddress({
              street: county || "Unknown Street",
              city: state_district || "Unknown City",
              state: state || "Unknown State",
              country: country || "Unknown Country",
              postcode: postcode || "Unknown Postcode",
            });
          } else {
            setError("Unable to fetch address details.");
          }
        } catch (err) {
          setError("Error fetching address details.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAddress();
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-[#FFCD05] text-black relative z-50">
      <section className="w-full bg-[#FFCD05] border-b border-gray-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex   justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 ">
            <div className="hidden sm:flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-800" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium tracking-tight font-sans text-gray-800">
                abc@gmail.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-800" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium tracking-tight font-sans text-gray-800">
                578-393-4937
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <span className="text-xs sm:text-sm font-medium text-gray-400 animate-pulse">
                Loading location...
              </span>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-gray-800" aria-hidden="true" />
                {address && (
                  <span className="text-xs sm:text-sm font-medium tracking-tight font-sans text-gray-800">
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country} {address.postcode}
                  </span>
                )}
                {error && (
                  <span className="text-xs sm:text-sm font-medium text-red-400">
                    {error}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </header>
  );
}
