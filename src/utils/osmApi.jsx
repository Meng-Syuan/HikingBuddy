const getGeoJSON = {
  hostname: 'https://nominatim.openstreetmap.org/',

  async geopointSearch(lat, lng) {
    const response = await fetch(
      `${this.hostname}reverse?format=geojson&lat=${lat}&lon=${lng}`
    );
    return await response.json();
  },

  async inputSearch(query) {
    const response = await fetch(
      `${this.hostname}search?q=${query}&format=geojson`
    );
    return await response.json();
  },
};

export default getGeoJSON;
