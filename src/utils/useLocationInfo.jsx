import { useState, useEffect } from 'react';
import getGeoJson from '@utils/osmApi';
import { useSearchLocation } from '@utils/zustand.js';

const useLocationInfo = () => {
  const { setLocation, setLatlng, setValid, setInvalid } = useSearchLocation();
  const [searchedPosition, setSearchedPosition] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  //getGeoJsonData
  useEffect(() => {
    if (!searchedPosition) return;
    const lat = searchedPosition.lat;
    const lng = searchedPosition.lng;
    async function getGeoJsonData(lat, lng) {
      const geoJsonData = await getGeoJson.geopointSearch(lat, lng);
      setLocationInfo(geoJsonData);
    }
    getGeoJsonData(lat, lng);
  }, [searchedPosition]);

  //set latlng to state management
  useEffect(() => {
    if (!searchedPosition) return;
    const lat = searchedPosition.lat;
    const lng = searchedPosition.lng;
    setLatlng(lat, lng);
    console.log('setLatlng');
  }, [searchedPosition]);

  //set location to state management
  useEffect(() => {
    if (!locationInfo) return;
    if (!locationInfo.features) {
      setLocation('此處無法安排行程');
      setInvalid();
      return;
    }
    const address = locationInfo.features[0].properties.address;
    const { city, county, suburb, town, road, city_district, leisure } =
      address;
    const searchedLocation = `${city || ''}${county || ''}${suburb || ''}${
      town || ''
    }${city_district || ''}${road || ''}${leisure || ''}`;

    setLocation(searchedLocation || '此處無法安排行程');
    searchedLocation ? setValid() : setInvalid();
  }, [locationInfo]);

  return searchedPosition;
};

export default useLocationInfo;
