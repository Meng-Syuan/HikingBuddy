import { create } from 'zustand';

export const useSearchLocation = create((set, get) => ({
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

export const useSearchLocations = create((set, get) => ({
  searchLocations: null,
  isLocationChecked: false,
  setSearchLocations: (searchLocations) => set({ searchLocations }),
  resetSearchLocations: () => set({ searchLocations: null }),
  checkLocation: () => set({ isLocationChecked: true }),
  choosingLocation: () => set({ isLocationChecked: false }),
}));
