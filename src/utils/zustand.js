import { create } from 'zustand';

//planning
export const useSearchSingleLocationState = create((set) => ({
  geoJSON: null,
  location: null,
  geopoint: null,
  isSearchValid: false,
  searchResults: null,
  setLocationState: (key, value) => set({ [key]: value }),
  setSearchInvalid: () => set({ isSearchValid: false }),
  setSearchValid: () => set({ isSearchValid: true }),
}));

export const useSearchLocations = create((set) => ({
  searchLocations: null,
  isLoading: false,
  setSearchLocations: (searchLocations) => set({ searchLocations }),
  resetSearchLocations: () => set({ searchLocations: null }),
  setIsLoading: (bool) => set({ isLoading: bool }),
}));

export const useScheduleArrangement = create((set) => ({
  temporaryScheduleId: null,
  gpxPoints: null,
  gpxUrl: null,
  gpxFileName: '',
  tripName: '',
  itineraries_dates: [],
  itineraries_datetime: [],
  locationNumber: 0,
  newItinerary: null,
  mapMarkers: [],
  setScheduleArrangement: (key, value) => set({ [key]: value }),
  addGeopoint: (lat, lng, id, name, number) =>
    set((state) => ({
      mapMarkers: [...state.mapMarkers, { lat, lng, id, name, number }],
    })),
}));

export const useUserState = create((set) => ({
  userData: null,
  userPhoto: '',
  activeScheduleId: null,
  listsConfirmedStatus: [],
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
  gpxPoints: null, //different from planPage
  gpxUrl: null,
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
  resetPostState: () =>
    set({
      postId: '',
      tripName: '',
      title: '',
      content: '',
      allUploadPhotos: [],
      mainPhoto: '',
      markers: [],
    }),
}));

export const usePostReadingState = create((set) => ({
  id: '',
  title: '',
  content: '',
  mainPhoto: '',
  createTime: null,
  setPostReadingState: (key, value) => set({ [key]: value }),
}));

export const useHomepageMarkers = create((set) => ({
  postWithMarkers: [],
  setPostWithMarkers: (key, value) => set({ [key]: value }),
}));
