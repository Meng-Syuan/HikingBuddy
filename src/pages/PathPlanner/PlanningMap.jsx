import styled from 'styled-components';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvent,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
//utils
import {
  useSearchSingleLocationState,
  useScheduleArrangement,
} from '@/zustand';
import getGeoJSON from '@/utils/osmApi';

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

const scheduledMarker = (number) => {
  return L.divIcon({
    className: 'numbered-marker',
    html: `
      <div class="marker-container" >
        <img src="${grayMarker}" alt="Marker" class="marker-image" style="width: 38px"/>
        <div class="marker-number" style="position: absolute; top: 3px; left: 50%; transform: translateX(-50%); background: #fff; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center">${number}</div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [1, -34],
    shadowUrl,
    shadowSize: [40, 42],
    shadowAnchor: [14, 42],
  });
};

const StyledMapContainer = styled(MapContainer)`
  min-height: calc(100vh - 80px);
  width: 100%;
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
        icon={scheduledMarker(geopoint.number)}
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
    setLocationState('isLoading', true);
    setLocationState('geopoint', e.latlng);
  });

  //get geoJSON data
  useEffect(() => {
    if (!geopoint) return;
    const lat = geopoint.lat;
    const lng = geopoint.lng;
    async function getGeoJSONdata(lat, lng) {
      const geoJsonData = await getGeoJSON.geopointSearch(lat, lng);
      if (Object.keys(geoJsonData).includes('error')) {
        setLocationState('isLoading', false);
        setSearchInvalid();
      } else {
        setLocationState('isLoading', false);
        setLocationState('geoJSON', geoJsonData);
      }
    }
    getGeoJSONdata(lat, lng);
  }, [geopoint]);

  //set location to state management
  useEffect(() => {
    if (!geoJSON) return;
    const address = geoJSON.features[0].properties.address;
    console.log(address);
    const {
      city,
      county,
      suburb,
      town,
      road,
      city_district,
      leisure,
      village,
      highway,
      amenity,
      tourism,
    } = address;
    const searchedLocation = `${city || ''}${county || ''}${suburb || ''}${
      town || ''
    }${city_district || ''}${road || ''}${leisure || ''}${village || ''}${
      highway || ''
    }${amenity || ''}${tourism || ''}`;
    if (!searchedLocation) {
      setSearchInvalid();
    } else {
      setLocationState('location', searchedLocation);
      setSearchValid();
    }
  }, [geoJSON]);

  return geopoint ? <Marker position={geopoint} /> : null;
};

const PathPlannerMap = () => {
  const { geopoint } = useSearchSingleLocationState();
  const mapRef = useRef(null);
  const { gpxPoints } = useScheduleArrangement();

  useEffect(() => {
    if (geopoint && mapRef.current) {
      mapRef.current.setView(geopoint, 18);
    }
  }, [geopoint]);

  useEffect(() => {
    if (!gpxPoints || !mapRef.current) return;
    const starting = gpxPoints[0];
    mapRef.current.setView(starting, 17);
  }, [gpxPoints]);

  return (
    <>
      <SearchInputField />
      <StyledMapContainer
        center={geopoint || [23.5, 121]}
        zoom={8}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gpxPoints && (
          <Polyline
            pathOptions={{ color: 'red', weight: 5 }}
            positions={gpxPoints}
          />
        )}

        <TemporaryScheduleMarkers />
        <SearchedPositionMarker />
      </StyledMapContainer>
      <SearchedResult />
    </>
  );
};

export default PathPlannerMap;
