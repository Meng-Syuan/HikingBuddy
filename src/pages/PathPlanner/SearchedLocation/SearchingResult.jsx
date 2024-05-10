import {
  useSearchSingleLocationState,
  useScheduleArrangement,
} from '@utils/zustand';
import styled from 'styled-components';
import color from '@utils/theme';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';

const SearchLocationContainer = styled.div`
  position: fixed;
  z-index: 400;
  transform: translateX(150%);
  bottom: 35px;
  width: 300px;
  min-height: 60px;
  padding: 1.25rem;
  border-radius: 5px;
  background-color: ${color.lightBackgroundColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const LocationName = styled.h4`
  width: 200px;
  letter-spacing: 1px;
  font-size: 0.875rem;
`;
const LatLngwrapper = styled.div`
  display: flex;
  align-items: center;
`;
const LatLng = styled.span`
  font-size: 0.875rem;
`;
const WGS84_small = styled.small`
  font-size: 0.625rem;
  line-height: 0.675rem;
  padding: 2px 4px;
  margin-right: 5px;
  background-color: #fff0c9;
  border-radius: 3px;
`;
const AddToSchedule_btn = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${color.borderColor};
  background-color: ${color.lightBackgroundColor};
  &:hover {
    background-color: #fff;
    cursor: pointer;
  }
`;

const SearchingResult = () => {
  const { location, geopoint, isSearchValid, setLocationState } =
    useSearchSingleLocationState();
  const {
    temporaryScheduleId,
    locationNumber,
    setScheduleArrangement,
    addGeopoint,
  } = useScheduleArrangement();
  const { addLocationToDB } = useSchedulesDB();

  const handleAddLocation = async () => {
    const itineraryId = await addLocationToDB(
      temporaryScheduleId,
      geopoint,
      location
    );
    addGeopoint(
      geopoint.lat,
      geopoint.lng,
      itineraryId,
      location,
      locationNumber + 1
    );
    setLocationState('location', null);
    setScheduleArrangement('locationNumber', locationNumber + 1);
  };

  return (
    <>
      {location && (
        <SearchLocationContainer>
          <ContentWrapper>
            <LocationName>
              {isSearchValid ? location : '此處無法安排行程'}
            </LocationName>
            <LatLngwrapper>
              <WGS84_small>WGS84</WGS84_small>
              <LatLng>
                {` (${geopoint.lat.toFixed(5)}, ${geopoint.lng.toFixed(5)})`}
              </LatLng>
            </LatLngwrapper>
          </ContentWrapper>
          {isSearchValid && (
            <AddToSchedule_btn onClick={handleAddLocation}>
              新增
            </AddToSchedule_btn>
          )}
        </SearchLocationContainer>
      )}
    </>
  );
};

export default SearchingResult;
