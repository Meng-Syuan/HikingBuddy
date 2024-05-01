import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvent,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import getGeoJSON from '@utils/osmApi';
import {
  useSearchSingleLocationState,
  useScheduleArrangement,
} from '@utils/zustand';
import { useEffect, useState, useRef } from 'react';

//components
import SearchInputField from './SearchedLocation/SearchInput';
import SearchedResult from './SearchedLocation/SearchingResult';

//Adjust for invisible Marker after deploying due to webpack building
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import grayMarker from '../../assets/img/grayMarker.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
const scheduledMarker = L.icon({
  iconUrl: grayMarker,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [40, 42],
  shadowAnchor: [14, 42],
});

const StyledMapContainer = styled(MapContainer)`
  height: calc(100vh - 80px);
`;

const PopupContent = styled.span`
  font-size: 0.875rem;
`;

const TemporaryScheduleMarkers = () => {
  const { mapMarkers } = useScheduleArrangement();
  return (
    mapMarkers &&
    mapMarkers.map((geopoint) => (
      <Marker
        position={{ lat: geopoint.lat, lng: geopoint.lng }}
        key={geopoint.id}
        icon={scheduledMarker}
      >
        <Popup>
          <PopupContent>{geopoint.name}</PopupContent>
        </Popup>
      </Marker>
    ))
  );
};

const SearchedPositionMarker = () => {
  const {
    setLocationState,
    geoJSON,
    geopoint,
    setSearchValid,
    setSearchInvalid,
  } = useSearchSingleLocationState();

  // useMapEvent should be used in MapContainer, get latlng and the marker
  useMapEvent('click', (e) => {
    setLocationState('geopoint', e.latlng);
  });

  //get geoJSON data
  useEffect(() => {
    if (!geopoint) return;
    const lat = geopoint.lat;
    const lng = geopoint.lng;
    async function getGeoJSONdata(lat, lng) {
      const geoJsonData = await getGeoJSON.geopointSearch(lat, lng);
      setLocationState('geoJSON', geoJsonData);
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

    setLocationState('location', searchedLocation || null);

    searchedLocation.length > 0 ? setSearchValid() : setSearchInvalid();
  }, [geoJSON]);

  return geopoint ? <Marker position={geopoint} /> : null;
};

const PathPlannerMap = () => {
  const { geopoint } = useSearchSingleLocationState();
  const [zoom, setZoom] = useState(null);
  const mapRef = useRef(null);
  const { gpxPoints } = useScheduleArrangement();

  useEffect(() => {
    if (geopoint && mapRef.current) {
      setZoom(15);
      console.log(geopoint);
      mapRef.current.setView(geopoint);
    }
  }, [geopoint]);

  useEffect(() => {
    console.log(zoom);
  }, [zoom]);

  return (
    <>
      <SearchInputField />
      <StyledMapContainer
        center={geopoint || [23.5, 121]}
        zoom={zoom || 8}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gpxPoints && (
          <Polyline pathOptions={{ color: '#8b572a' }} positions={gpxPoints} />
        )}

        <TemporaryScheduleMarkers />
        <SearchedPositionMarker />
      </StyledMapContainer>
      <SearchedResult />
    </>
  );
};

export default PathPlannerMap;
