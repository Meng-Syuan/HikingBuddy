import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';

import { Tooltip } from 'react-tippy';
//utils
import uploadFile from '@/utils/uploadFile';
import { useScheduleArrangement } from '@/zustand';
import { showErrorToast } from '@/utils/sweetAlert';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';

const UploadGpxButton = styled.div`
  .gpxUpload {
    font-size: 2rem;
    color: #6e6e6e;
    &:hover {
      color: #0161bb;
      cursor: pointer;
    }
  }
`;

const GPXfileWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: baseline;
`;

const GPXfileName = styled.span`
  font-size: 0.85rem;
  background-color: #fff0c9;
  padding: 2px 6px;
  border-radius: 4px;
  font-style: italic;
`;

const UploadGPX = () => {
  const { setScheduleArrangement, temporaryScheduleId, gpxFileName } =
    useScheduleArrangement();
  const { getUploadFileUrl } = uploadFile();

  const handleUploadGPX = async (e) => {
    const file = e.target.files[0];
    const url = await getUploadFileUrl('gpx_file', file, temporaryScheduleId); //storage
    try {
      const firestoreItem = {
        gpxFileName: file.name,
        gpxUrl: url,
      };
      await setFirestoreDoc('schedules', temporaryScheduleId, firestoreItem);
      setScheduleArrangement('gpxFileName', file.name); //global state
      setScheduleArrangement('gpxUrl', url);
    } catch (error) {
      await showErrorToast('發生錯誤', error.message);
    }
  };
  return (
    <>
      <input
        type="file"
        accept=".gpx"
        onChange={handleUploadGPX}
        id="gpxUpload"
        style={{ display: 'none' }}
      />
      <GPXfileWrapper>
        {gpxFileName && <GPXfileName>{gpxFileName}</GPXfileName>}
        <UploadGpxButton as="label" htmlFor="gpxUpload">
          <Tooltip
            title="上傳 GPX"
            arrow={true}
            position="right"
            size="small"
            theme="light"
          >
            <FontAwesomeIcon icon={faFileArrowUp} className="gpxUpload" />
          </Tooltip>
        </UploadGpxButton>
      </GPXfileWrapper>
    </>
  );
};

export default UploadGPX;
