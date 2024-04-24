import { create } from 'zustand';

//planning
export const useSearchLocation = create((set) => ({
  geoJSON: null,
  location: null,
  geopoint: null,
  isSearchValid: false,
  searchResults: null,
  //一堆 set 的地方可以改掉!!
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
  tripName: '',
  itineraries: [
    {
      itineraryId: '',
      date: '',
      datetime: '',
    },
  ],
  newItinerary: null,
  geopoints: [],

  setTripName: (tripName) => set({ tripName }),

  setItineraries: (itineraries) => set({ itineraries }),

  updateItinerariesWithDates: (itinerariesWithDates) =>
    set((state) => {
      const updatedItineraries = state.itineraries.map((itinerary) => {
        const matchingItem = itinerariesWithDates.find(
          (item) => item.itineraryId === itinerary.itineraryId
        );
        return { ...itinerary, date: matchingItem.date };
      });
      return { itineraries: updatedItineraries };
    }),

  updateItinerariesWithDatetime: (id, timeDiff) =>
    set((state) => {
      const updatedItineraries = state.itineraries.map((itinerary) => {
        if (id === itinerary.itineraryId) {
          if (isNaN(itinerary.date)) {
            return {
              ...itinerary,
              datetime: timeDiff,
            };
          } else {
            return {
              ...itinerary,
              datetime: itinerary.date + timeDiff,
            };
          }
        } else {
          return itinerary;
        }
      });
      return { itineraries: updatedItineraries };
    }),

  setNewItinerary: (newItinerary) => set({ newItinerary }),

  setGeopoints: (geopoints) => set({ geopoints }),
  addGeopoint: (lat, lng, id, name) =>
    set((state) => ({
      geopoints: [...state.geopoints, { lat, lng, id, name }],
    })),
}));

//profile
export const useUserData = create((set) => ({
  userData: null,
  activeScheduleId: null,
  futureSchedules: [],
  pastSchedules: [],
  setUserData: (key, value) => set({ [key]: value }),
  setFutureSchedules: (futureSchedules) => set({ futureSchedules }),
  setPastSchedules: (pastSchedules) => set({ pastSchedules }),
}));

export const useScheduleData = create((set) => ({
  scheduleInfo: null,
  scheduleDetails: null,
  isActive: null,
  locationNotes: {},
  gearChecklist: [],
  otherItemChecklist: [],
  setScheduleData: (key, value) => set({ [key]: value }),
  addLocationNote: (id, value) =>
    set((state) => ({
      locationNotes: { ...state.locationNotes, [id]: value },
    })),
  addNewItemToChecklist: (key, id) =>
    set((state) => ({
      [key]: [...state[key], { id, isChecked: false }],
    })),
  toggleActiveState: () => set((state) => ({ isActive: !state.isActive })),
}));

export const useProtectorPageData = create((set) => ({
  hikerInfo: '',
  hikerPhoto: '',
  setProtectorPageData: (key, value) => set({ [key]: value }),
  updateHikerInfo: (key, value) =>
    set((state) => ({
      hikerInfo: {
        ...state.hikerInfo,
        [key]: value,
      },
    })),
}));
