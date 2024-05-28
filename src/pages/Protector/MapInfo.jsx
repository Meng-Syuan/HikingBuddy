import styled from 'styled-components';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { lightFormat } from 'date-fns';

//utils
import { useScheduleArrangement, useUserState } from '@/zustand';
import { Toast, showErrorToast } from '@/utils/sweetAlert';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';

//Adjust for invisible Marker after deploying due to webpack building
import L from 'leaflet';
import grayMarker from '../../assets/img/grayMarker.png';
import pinkMarker from '../../assets/img/pinkMarker.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useState, useRef } from 'react';

//#region
const normalMarker = L.icon({
  iconUrl: grayMarker,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [40, 42],
  shadowAnchor: [14, 42],
});
const arrivedMarker = L.icon({
  iconUrl: pinkMarker,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [40, 42],
  shadowAnchor: [14, 42],
});

const StyledMapContainer = styled(MapContainer)`
  min-height: 100%;
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 50px;
`;
const H3 = styled.h3`
  align-self: start;
`;

const Geopoint = styled.span`
  font-size: 0.7rem;
  align-self: center;
  margin-bottom: 1rem;
`;

const EstimatedArrival = styled.span`
  font-size: 0.75rem;
  align-self: end;
  margin-bottom: 0.5rem;
`;

const ArrivingTime = styled.span`
  font-size: 0.875rem;
  background-color: #fff0c9;
  padding: 0 3px;
  margin: 0.5rem 0;
  align-self: center;
  position: relative;
  top: 0.5rem;
`;

const StyledButton = styled(Button)`
  font-size: 0.8rem;
  align-self: end;
`;

//#endregion

const Markers = ({ isEditable }) => {
  const { activeScheduleId } = useUserState();
  const { mapMarkers, setScheduleArrangement } = useScheduleArrangement();

  const handleArrival = async (id) => {
    const currentTimestamp = Date.now();
    const mapMarkersWithArrivalInfo = mapMarkers.map((marker) => {
      if (marker.id === id) {
        return { ...marker, isArrived: true, arrivalTime: currentTimestamp };
      } else {
        return marker;
      }
    });
    setScheduleArrangement('mapMarkers', mapMarkersWithArrivalInfo);

    const firestoreItem = { arrivalTime: currentTimestamp, isArrived: true };

    try {
      await setFirestoreDoc(
        `schedules/${activeScheduleId}/itineraries`,
        id,
        firestoreItem
      );
      Toast.fire({
        position: 'center',
        timer: 800,
        timerProgressBar: false,
        title: '恭喜抵達🎉🎉',
        text: `抵達時間：${lightFormat(currentTimestamp, 'M/d HH:mm')}`,
        icon: 'success',
        width: '300px',
      });
    } catch (error) {
      await showErrorToast('發生錯誤', error.message);
    }
  };

  return (
    mapMarkers.length > 1 &&
    mapMarkers.map((marker) => {
      const ETA = lightFormat(marker?.ETA, 'M / d HH:mm');
      const arrivalTime = marker.arrivalTime
        ? lightFormat(marker.arrivalTime, 'M / d HH:mm')
        : '';
      if (!marker.isArrived) {
        return (
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            key={marker.id}
            icon={normalMarker}
          >
            <Popup>
              <PopupContent>
                <H3>{marker.name}</H3>
                <Geopoint>{`(${marker.lat.toFixed(5)}, ${marker.lng.toFixed(
                  5
                )})`}</Geopoint>
                <EstimatedArrival>預估抵達：{ETA}</EstimatedArrival>
                {isEditable && (
                  <StyledButton
                    variant="contained"
                    size="small"
                    endIcon={<FontAwesomeIcon icon={faCheck} size="2xs" />}
                    onClick={() => handleArrival(marker.id)}
                  >
                    抵達
                  </StyledButton>
                )}
              </PopupContent>
            </Popup>
          </Marker>
        );
      } else {
        return (
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            key={marker.id}
            icon={arrivedMarker}
          >
            <Popup>
              <PopupContent>
                <H3>{marker.name}</H3>
                <Geopoint>{`(${marker.lat.toFixed(5)}, ${marker.lng.toFixed(
                  5
                )})`}</Geopoint>
                <EstimatedArrival>預估抵達：{ETA}</EstimatedArrival>
                <ArrivingTime>抵達時間：{arrivalTime}</ArrivingTime>
              </PopupContent>
            </Popup>
          </Marker>
        );
      }
    })
  );
};

const MapInfo = ({ isEditable, gpxPoints }) => {
  const { mapMarkers } = useScheduleArrangement();
  const [center, setCenter] = useState([23.5, 121]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center);
    }
  }, [center]);

  useEffect(() => {
    if (mapMarkers.length < 1) return;
    const firstMarker = mapMarkers.sort((a, b) => a.ETA - b.ETA)[0];
    const center = [firstMarker.lat, firstMarker.lng];
    setCenter(center);
  }, [mapMarkers]);

  return (
    <>
      <StyledMapContainer center={center} zoom={10} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gpxPoints && (
          <Polyline pathOptions={{ color: 'red' }} positions={gpxPoints} />
        )}

        <Markers isEditable={isEditable} />
      </StyledMapContainer>
    </>
  );
};

export default MapInfo;
