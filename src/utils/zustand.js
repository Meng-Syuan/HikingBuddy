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

  //可能可以刪掉？
  // updateItinerariesWithDates: (itineraries_dates) =>
  //   set(() => {
  //     // const updatedItineraries = state.itineraries.map((itinerary) => {
  //     //   const matchingItem = itineraries_dates.find(
  //     //     (item) => item.itineraryId === itinerary.itineraryId
  //     //   );
  //     //   return { ...itinerary, date: matchingItem.date };
  //     // });
  //     // return { itineraries_dates: updatedItineraries };
  //     const updatedItineraries = itineraries_dates.map((itinerary) => ({
  //       ...itinerary,
  //       date: itinerary.date,
  //     }));
  //     return {
  //       itineraries_dates: updatedItineraries,
  //     };
  //   }),

  //可能可以刪掉
  // updateItinerariesWithDatetime: (id, timeDiff) =>
  //   set((state) => {
  //     const updatedItineraries = state.itineraries.map((itinerary) => {
  //       if (id === itinerary.itineraryId) {
  //         if (isNaN(itinerary.date)) {
  //           return {
  //             ...itinerary,
  //             datetime: timeDiff,
  //           };
  //         } else {
  //           return {
  //             ...itinerary,
  //             datetime: itinerary.date + timeDiff,
  //           };
  //         }
  //       } else {
  //         return itinerary;
  //       }
  //     });
  //     return { itineraries: updatedItineraries };
  //   }),

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

export const usePostReadState = create((set) => ({
  // userPostsIds: [],
  // setPostReadState: (key, value) => set({ [key]: value }),
}));
