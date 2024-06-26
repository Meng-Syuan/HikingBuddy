import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { lightFormat } from 'date-fns';
import { usePostMapState } from '@/zustand';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWVuZ3N5dWFuIiwiYSI6ImNsdXBkMnl5djFsa24yanBvNHF2cWg1cW8ifQ.ern3CJP54d0LtA9e2VDwxQ';

const MapContainer = styled.div`
  width: 100%;
  height: 80vh;
  .mapboxgl-popup-content {
    min-width: 135px;
    cursor: pointer;
    padding: 0;
    border-radius: 5px;
    .mapboxgl-popup-close-button {
      display: none;
    }
    .wrapper {
      border-radius: 5px 5px 0 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .popup-title {
      border-radius: 5px 5px 0 0;
      padding: 5px 1rem;
      background-color: #fffacd;
      letter-spacing: 2px;
      text-align: center;
    }
    .create-time {
      font-size: 0.75rem;
      align-self: end;
      position: relative;
      right: 12px;
      bottom: 5px;
    }
  }
`;
const Sidebar = styled.div`
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 0.75rem;
  max-width: 30vw;
  z-index: 1;
  position: absolute;
  border-radius: 4px;
`;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(121.1604);
  const [lat, setLat] = useState(23.7898);
  const [zoom, setZoom] = useState(7);
  const { postMarkers } = usePostMapState();
  const navigate = useNavigate();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  useEffect(() => {
    if (postMarkers.length === 0) return;
    const handlePopupClick = (marker) => {
      navigate(`/post/${marker.id}`);
    };

    postMarkers.map((marker) => {
      const createTime = lightFormat(marker.createTime, 'yyyy-MM-dd');
      const popup = new mapboxgl.Popup().setHTML(
        `<div class="wrapper">
           <h4 class="popup-title">${marker.title}</h4>
           <span class="create-time">${createTime}</span>
         </div>`
      );

      marker.coordinates &&
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat(marker.coordinates)
          .setPopup(popup)
          .addTo(map.current);

      popup.on('open', () => {
        popup._content.addEventListener('click', () => {
          handlePopupClick(marker);
        });
      });
    });
  }, [postMarkers]);

  return (
    <>
      <Sidebar>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </Sidebar>
      <MapContainer ref={mapContainer} />
    </>
  );
};

export default Map;
