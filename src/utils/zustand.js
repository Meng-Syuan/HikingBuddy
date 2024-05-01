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
  temporaryScheduleId: null,
  gpxPoints: null,
  gpxFileName: '',
  tripName: '',
  itineraries_dates: [],
  itineraries_datetime: [],
  newItinerary: null,
  mapMarkers: [],
  setScheduleArrangement: (key, value) => set({ [key]: value }),

  setTripName: (tripName) => set({ tripName }),

  setItineraries: (itineraries) => set({ itineraries }),

  setNewItinerary: (newItinerary) => set({ newItinerary }),

  setGeopoints: (mapMarkers) => set({ mapMarkers }),
  addGeopoint: (lat, lng, id, name) =>
    set((state) => ({
      mapMarkers: [...state.mapMarkers, { lat, lng, id, name }],
    })),
}));

//profile
export const useUserState = create((set) => ({
  userData: null,
  userPhoto: '',
  activeScheduleId: null,
  futureSchedules: [],
  pastSchedules: [],
  userPostsIds: [],
  postsData: [],
  setUserState: (key, value) => set({ [key]: value }),
  deleteTrip: (schedules, id) =>
    set((state) => {
      const updateTrips = state[schedules].filter((trip) => trip.id !== id);
      return {
        ...state,
        [schedules]: updateTrips,
      };
    }),
}));

export const useScheduleState = create((set) => ({
  scheduleInfo: null,
  scheduleDetails: null,
  isActive: null,
  locationNotes: {},
  gearChecklist: [],
  otherItemChecklist: [],
  // arrivingTime
  setScheduleState: (key, value) => set({ [key]: value }),
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

export const usePostState = create((set) => ({
  postId: '', //required
  tripName: '',
  title: '',
  content: '',
  allUploadPhotos: [],
  mainPhoto: '',
  markers: [],
  setPostState: (key, value) => set({ [key]: value }),
}));

export const usePostReadingState = create((set) => ({
  id: '',
  title: '',
  content: '',
  mainPhoto: '',
  createTime: null,
  setPostReadingState: (key, value) => set({ [key]: value }),
}));
