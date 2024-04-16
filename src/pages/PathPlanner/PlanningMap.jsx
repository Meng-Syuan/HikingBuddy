import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import getGeoJSON from '@utils/osmApi';
import { useSearchLocation } from '@utils/zustand';
import { useEffect } from 'react';
//components
import SearchInputField from './SearchedLocation/SearchInput';
import SearchedLocationInfo from './SearchedLocation/LocationDetails';

const StyledMapContainer = styled(MapContainer)`
  height: calc(100vh - 100px);
`;

const SearchedPositionMarker = () => {
  const {
    setGeoJSON,
    setLocation,
    setGeopoint,
    setSearchValid,
    setSearchInvalid,
  } = useSearchLocation();
  const geoJSON = useSearchLocation((state) => state.geoJSON);
  const geopoint = useSearchLocation((state) => state.geopoint);

  // useMapEvent should be used in MapContainer, get latlng and the marker
  useMapEvent('click', (e) => {
    setGeopoint(e.latlng);
  });

  //get geoJSON data
  useEffect(() => {
    if (!geopoint) return;
    const lat = geopoint.lat;
    const lng = geopoint.lng;
    async function getGeoJSONdata(lat, lng) {
      const geoJsonData = await getGeoJSON.geopointSearch(lat, lng);
      setGeoJSON(geoJsonData);
    }
    getGeoJSONdata(lat, lng);
  }, [geopoint]);

  //set location to state management
  useEffect(() => {
    if (!geoJSON) return;
    if (!geoJSON.features) {
      setSearchInvalid();
      return;
    }
    const address = geoJSON.features[0].properties.address;
    const { city, county, suburb, town, road, city_district, leisure } =
      address;
    const searchedLocation = `${city || ''}${county || ''}${suburb || ''}${
      town || ''
    }${city_district || ''}${road || ''}${leisure || ''}`;

    setLocation(searchedLocation || null);

    searchedLocation.length > 0 ? setSearchValid() : setSearchInvalid();
  }, [geoJSON]);

  return geopoint ? (
    <Marker position={geopoint}>
      <Popup>點選了這個地標</Popup>
    </Marker>
  ) : null;
};

const PathPlannerMap = () => {
  return (
    <>
      <SearchInputField />
      <StyledMapContainer center={[23.5, 121]} zoom={8}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* 改成自己的位置*****************改樣式!! */}
        <Marker position={{ lat: 23.5, lng: 121 }}>
          <Popup>點地標可以出現文字哦</Popup>
        </Marker>
        <SearchedPositionMarker />
      </StyledMapContainer>
      <SearchedLocationInfo />
    </>
  );
};

export default PathPlannerMap;
