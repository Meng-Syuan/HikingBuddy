import styled from 'styled-components';
import color from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

//utils
import { useSearchSingleLocationState, useSearchLocations } from '@/zustand';
import getGeoJSON from '@/utils/getGeoJSON';

const StyledSearchField = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 450;
  border-radius: 5px;
`;
const Form = styled.form`
  width: 200px;
  padding-right: 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const SearchInput = styled.input`
  width: calc(95% - 25px);
  padding-left: 1rem;
  border-radius: 5px 0 0 5px;
  min-height: 40px;
  font-size: 1rem;
  border: none;
`;
const SearchButton = styled(FontAwesomeIcon)`
  padding: 3px;
  border-radius: 0 5px 5px 0;
  width: 25px;
  height: 25px;
  color: ${color.textColor};
  cursor: pointer;
  &:hover {
    color: ${color.secondary};
  }
`;

const SearchResultsDiv = styled.div`
  background-color: #fff;
  margin-top: 2px;
  border-radius: 5px;
  max-height: 235px;
  overflow-y: auto;
`;

const SearchResultItem = styled.div`
  width: 200px;
  min-height: 75px;
  padding: 5px 1.25rem;
  border-bottom: 1px solid ${color.borderColor};
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  word-break: break-all;

  &:hover {
    background-color: #fff0c9;
    cursor: pointer;
  }
`;
const LoadingWrapper = styled(SearchResultItem)`
  &:hover {
    background-color: transparent;
    cursor: default;
  }
`;

const NotFoundResult = styled(LoadingWrapper)``;

const ResultTitle = styled.h5`
  align-self: flex-start;
`;

const ResultAddress = styled.span`
  font-size: 0.75rem;
  letter-spacing: 1px;
  align-self: flex-start;
`;

const CloseResults = styled.div`
  position: relative;
  width: 100%;
`;
const StyledButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  z-index: 450;
`;

const SearchResultsList = () => {
  const { searchLocations } = useSearchLocations();
  const { setLocationState } = useSearchSingleLocationState();
  const { resetSearchLocations, isLoading } = useSearchLocations();

  const handleLocationSelected = (geopoint) => {
    setLocationState('geopoint', geopoint);
    resetSearchLocations();
  };

  return (
    <>
      <SearchResultsDiv>
        {!isLoading && (
          <CloseResults>
            <StyledButton onClick={resetSearchLocations}>
              <ClearIcon />
            </StyledButton>
          </CloseResults>
        )}
        {isLoading ? (
          <LoadingWrapper>
            <ReactLoading
              type="spinningBubbles"
              color={`${color.textColor}`}
              width="35px"
              height="35px"
            ></ReactLoading>
          </LoadingWrapper>
        ) : searchLocations === 'notFound' ? (
          <>
            <NotFoundResult>
              <ResultTitle>查無結果</ResultTitle>
              <ResultTitle>建議提供更多關鍵字</ResultTitle>
            </NotFoundResult>
          </>
        ) : (
          searchLocations?.map((location) => (
            <>
              <SearchResultItem
                key={location.id}
                onClick={() => handleLocationSelected(location.geopoint)}
              >
                <ResultTitle>{`${location.name}`}</ResultTitle>
                <ResultAddress>{`${location.display_name}`}</ResultAddress>
              </SearchResultItem>
            </>
          ))
        )}
      </SearchResultsDiv>
    </>
  );
};
const SearchInputField = () => {
  const { setSearchLocations, setIsLoading } = useSearchLocations();

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  //organize search results
  useEffect(() => {
    if (!searchResults) return;
    if (searchResults.features.length === 0) {
      setSearchLocations('notFound');
    } else {
      const organizedSearchResults = searchResults.features.map((feature) => {
        const id = feature.properties.osm_id;
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        const name = feature.properties.name;
        const display_name = feature.properties.display_name
          .split(', ')
          .reverse()
          .join('');
        return { id, geopoint: { lat, lng }, name, display_name };
      });
      setSearchLocations(organizedSearchResults);
    }
  }, [searchResults]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchInput('');
    setIsLoading(true);
    const geoJsonData = await getGeoJSON.inputSearch(searchInput);
    setSearchResults(geoJsonData);
    setIsLoading(false);
  };
  return (
    <>
      <StyledSearchField>
        <Form onSubmit={handleSearchSubmit}>
          <SearchInput
            placeholder="搜尋地點或座標"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <SearchButton
            type="button"
            onClick={handleSearchSubmit}
            icon={faMagnifyingGlass}
          ></SearchButton>
        </Form>
        <SearchResultsList />
      </StyledSearchField>
    </>
  );
};

export default SearchInputField;
