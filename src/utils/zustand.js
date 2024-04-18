import { create } from 'zustand';

export const useSearchLocation = create((set) => ({
  geoJSON: null,
  location: null,
  geopoint: null,
  isSearchValid: false,
  searchResults: null,
  setGeoJSON: (data) => set({ geoJSON: data }),
  setLocation: (location) => set({ location }),
  setGeopoint: (latlng) => set({ geopoint: latlng }),
  setSearchInvalid: () => set({ isSearchValid: false }),
  setSearchValid: () => set({ isSearchValid: true }),
  setSearchResults: (searchResults) => set({ searchResults }),
}));

export const useSearchLocations = create((set) => ({
  searchLocations: null,
  isLocationChecked: false,
  setSearchLocations: (searchLocations) => set({ searchLocations }),
  resetSearchLocations: () => set({ searchLocations: null }),
  checkLocation: () => set({ isLocationChecked: true }),
  choosingLocation: () => set({ isLocationChecked: false }),
}));

export const useScheduleArrangement = create((set) => ({
  itineraries: [
    {
      itineraryId: '',
      location: '',
      date: '',
      datetime: '',
    },
  ],
  newItinerary: null,
  geopoints: [],
  setItineraries: (itineraries) => set({ itineraries }),
  setNewItinerary: (newItinerary) => set({ newItinerary }),
  addGeopoints: (geopoints) => set((prevState) => [...prevState]),
}));
