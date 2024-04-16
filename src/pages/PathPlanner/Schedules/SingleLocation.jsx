import styled from 'styled-components';
import color from '@utils/theme.js';

const ContentWrapper = styled.div`
  height: 40px;
  border: ${color.borderColor} 1px solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TimePicker = styled.input`
  width: 50px;
`; //引用 flatpickr?
const Location_Name = styled.h5``;

const DeleteButton = styled.button`
  border: none;
`;

const SingleLocation = ({ location }) => {
  return (
    <ContentWrapper>
      <TimePicker></TimePicker>
      <Location_Name>{location}</Location_Name>
      <DeleteButton>刪除</DeleteButton>
    </ContentWrapper>
  );
};

export default SingleLocation;

// const [state, setState] = useState([
//   { id: 1, name: 'shrek' },
//   { id: 2, name: 'fiona' },
// ]);
// return (
//   <ReactSortable list={state} setList={setState}>
//     {state.map((item) => (
//       <div key={item.id}>{item.name}</div>
//     ))}
//   </ReactSortable>
//   // <LocationWrapper>
//   //   <TimePicker>TimePicker</TimePicker>
//   //   <Location_Name>這邊寫點東西</Location_Name>
//   //   <button>刪除按鍵</button>
//   // </LocationWrapper>
// );
