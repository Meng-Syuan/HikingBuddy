import styled from 'styled-components';
import color, { screen } from '@/theme';
import ReactLoading from 'react-loading';
import { GeoPoint } from 'firebase/firestore';

//utils
import {
  useSearchSingleLocationState,
  useScheduleArrangement,
} from '@/zustand';
import addFirestoreDoc from '@/firestore/addFirestoreDoc';
import { showErrorToast } from '@/utils/sweetAlert';

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
  ${screen.xl} {
    right: 350px;
    transform: translateX(0px);
  }
  ${screen.md} {
    right: 10px;
  }
`;

const LoadingWrapper = styled(SearchLocationContainer)`
  justify-content: center;
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
  const { location, geopoint, isSearchValid, setLocationState, isLoading } =
    useSearchSingleLocationState();
  const {
    temporaryScheduleId,
    locationNumber,
    setScheduleArrangement,
    addMarkerOnScheduleMap,
  } = useScheduleArrangement();

  const handleAddLocation = async () => {
    const firestoreItem = {
      geopoint: new GeoPoint(geopoint.lat, geopoint.lng),
      location,
    };

    try {
      const itineraryId = await addFirestoreDoc(
        `schedules/${temporaryScheduleId}/itineraries`,
        firestoreItem,
        'itineraryId'
      );

      addMarkerOnScheduleMap(
        geopoint.lat,
        geopoint.lng,
        itineraryId,
        location,
        locationNumber + 1
      );
      setScheduleArrangement('locationNumber', locationNumber + 1); //display on the right section(schedule arrangement)
      setLocationState('location', null);
    } catch (error) {
      await showErrorToast('發生錯誤', error.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingWrapper>
          <ReactLoading
            type="spinningBubbles"
            color={`${color.textColor}`}
            width="35px"
            height="35px"
          />
        </LoadingWrapper>
      ) : location ? (
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
      ) : (
        ''
      )}
    </>
  );
};

export default SearchingResult;
