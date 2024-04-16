import { useSearchLocation } from '@utils/zustand';
import styled from 'styled-components';
import color from '@utils/theme';
import { schedulesDB } from '@utils/firestore.js';
import { useAuth } from '@clerk/clerk-react';

const SearchLocationContainer = styled.div`
  position: absolute;
  z-index: 1001;
  right: 15px;
  bottom: 35px;
  width: 300px;
  min-height: 60px;
  padding: 1.25rem;
  border-radius: 5px;
  background-color: ${color.lightBackgroundColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition-duration: 1s;
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

const LocationDetails = () => {
  const { userId } = useAuth();

  const location = useSearchLocation((state) => state.location);
  const geopoint = useSearchLocation((state) => state.geopoint);
  const isSearchValid = useSearchLocation((state) => state.isSearchValid);
  // const uniqueId = geopoint.lat.toString() + geopoint.lng.toString();

  const handleAddLocation = () => {
    schedulesDB.addLocation(userId, geopoint, location);
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

export default LocationDetails;
