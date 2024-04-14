import styled from 'styled-components';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from '../db.json';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWVuZ3N5dWFuIiwiYSI6ImNsdXBkMnl5djFsa24yanBvNHF2cWg1cW8ifQ.ern3CJP54d0LtA9e2VDwxQ';

const MapContainer = styled.div`
  margin-top: 150px;
  height: 800px;
`;
const Sidebar = styled.div`
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  margin: 12px;
  border-radius: 4px;
`;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(120.5726);
  const [lat, setLat] = useState(23.2812);
  const [zoom, setZoom] = useState(2);

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

    // Create default markers
    geoJson.features.map((feature) =>
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(feature.geometry.coordinates)
        .addTo(map.current)
    );

    // map.current.setLayoutProperty('country-label', 'text-field', [
    //   'get',
    //   `name_${'Chinese'}`,
    // ]);
  }, []);

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
