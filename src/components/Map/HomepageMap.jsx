import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import usePostsDB from '@utils/hooks/usePostsDB';
import { useUserState } from '@utils/zustand';
import { lightFormat } from 'date-fns';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWVuZ3N5dWFuIiwiYSI6ImNsdXBkMnl5djFsa24yanBvNHF2cWg1cW8ifQ.ern3CJP54d0LtA9e2VDwxQ';

const MapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
`;
const Sidebar = styled.div`
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 80px;
  left: 10px;
  border-radius: 4px;
`;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(120.5726);
  const [lat, setLat] = useState(23.2812);
  const [zoom, setZoom] = useState(2);
  const { getPostsList } = usePostsDB();
  const { userData } = useUserState();
  const [postWithMarkers, setPostWithMarkers] = useState([]);

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
    if (!userData) return;
    const fetchPostsAndMarkers = async () => {
      const postIds = userData.posts;
      const result = await getPostsList(postIds);
      const postWithMarkers = result.map((post) => {
        const markers = Object.values(post.markers);
        return markers.map((marker) => {
          return {
            id: post.id,
            title: post.title,
            coordinates: marker,
            createTime: post.createTime,
          };
        });
      });
      setPostWithMarkers(postWithMarkers.flat());
    };
    fetchPostsAndMarkers();
  }, [userData]);

  useEffect(() => {
    if (postWithMarkers.length === 0) return;
    if (postWithMarkers.length > 0) {
      postWithMarkers.map((marker) => {
        const createTime = lightFormat(marker.createTime, 'yyyy-MM-dd');
        marker.coordinates &&
          new mapboxgl.Marker({ color: 'red' })
            .setLngLat(marker.coordinates)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `
                <div>
                <a href="/post/${marker.id}" style="color: #000; display: block; margin-bottom: 1rem">${marker.title}</a>
                <span style="font-size: 12px;display: block">${createTime}</span>
                </div>
                `
              )
            )
            .addTo(map.current);
      });
    }
  }, [postWithMarkers]);

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
