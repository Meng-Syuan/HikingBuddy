import styled from 'styled-components';
import ButtonWrapper from '../../assets/components/Button/ButtonWrapper';
import hoverMixin from '@utils/hoverMixin';
import searchIcon from '../../assets/img/search.png';
import searchIcon_hover from '../../assets/img/search-hover.png';
import { useEffect, useState } from 'react';
import { useSearchLocation, useSearchLocations } from '@utils/zustand.js';
import getGeoJSON from '@utils/osmApi';
import color from '@utils/theme';

const StyledSearchField = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 1000;
  border-radius: 5px;
`;
const Form = styled.form`
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const SearchInput = styled.input`
  width: 160px;
  padding-left: 20px;
  border-radius: 5px 0 0 5px;
  height: 40px;
  font-size: 1rem;
  border: none;
`;
const SearchButton = styled(ButtonWrapper)`
  padding: 3px;
  border-radius: 0 5px 5px 0;
  ${hoverMixin('searchIcon_hover', 'searchIcon')}
`;

const SearchResultsDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  margin-top: 2px;
  border-radius: 5px;
  max-height: 235px;
  overflow-y: scroll;
  scrollbar-width: thin;
`;

const SearchResultItem = styled.button`
  width: 200px;
  min-height: 75px;
  padding: 5px 1.25rem;
  border: none;
  border-bottom: 1px solid ${color.borderColor};
  background-color: #fff;
  text-align: left;
  &:hover {
    background-color: #fff0c9;
    cursor: pointer;
  }
  h5 {
    line-height: 1.5rem;
  }
  span {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
`;

const SearchResultsList = () => {
  const searchLocations = useSearchLocations((state) => state.searchLocations);
  const { setGeopoint } = useSearchLocation();
  const { resetSearchLocations, checkLocation } = useSearchLocations();

  const handleLocationSelected = (geopoint) => {
    setGeopoint(geopoint);
    resetSearchLocations();
    checkLocation();
  };
  return (
    <>
      {searchLocations && (
        <SearchResultsDiv>
          {searchLocations.map((location) => (
            <SearchResultItem
              onClick={() => handleLocationSelected(location.geopoint)}
            >
              <h5>{`${location.name}`}</h5>
              <span>{`${location.display_name}`}</span>
            </SearchResultItem>
          ))}
        </SearchResultsDiv>
      )}
    </>
  );
};
const SearchInputField = () => {
  const { setSearchLocations, choosingLocation } = useSearchLocations();
  const isLocationChecked = useSearchLocations(
    (state) => state.isLocationChecked
  );

  const [searchInput, setSearchInput] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  //searching results
  useEffect(() => {
    if (!isSubmit) return;

    async function getGeoJSONdata(query) {
      const geoJsonData = await getGeoJSON.inputSearch(query);
      setSearchResults(geoJsonData);
    }
    getGeoJSONdata(searchInput);
    setIsSubmit(false);
    setSearchInput('');
  }, [isSubmit]);

  //organize search results
  useEffect(() => {
    if (!searchResults) return;
    if (searchResults.features.length === 0) return;
    const organizedSearchResults = searchResults.features.map((feature) => {
      const lat = feature.geometry.coordinates[1];
      const lng = feature.geometry.coordinates[0];
      const name = feature.properties.name;
      const display_name = feature.properties.display_name
        .split(', ')
        .reverse()
        .join('');
      return { geopoint: { lat, lng }, name, display_name };
    });
    setSearchLocations(organizedSearchResults);
  }, [searchResults]);

  //reset search results
  useEffect(() => {
    if (!isLocationChecked) return;
    setSearchLocations(null);
  }, [isLocationChecked]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    choosingLocation();
  };

  return (
    <>
      <StyledSearchField>
        <Form onSubmit={handleSearchSubmit}>
          <SearchInput
            placeholder="搜尋地點或座標"
            onChange={handleInputChange}
            value={searchInput}
          />
          <SearchButton type="button" onClick={handleSearchSubmit}>
            <img
              className="searchIcon"
              src={searchIcon}
              alt="search for the location"
            />
            <img
              className="searchIcon_hover"
              src={searchIcon_hover}
              alt="search for the location"
            />
          </SearchButton>
        </Form>
        <SearchResultsList />
      </StyledSearchField>
    </>
  );
};

export default SearchInputField;
