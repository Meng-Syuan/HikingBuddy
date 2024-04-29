import styled from 'styled-components';

const Button = styled.div`
  width: 40px;
  height: 40px;
`;
const ScratchBtn = () => {
  const handleTempPost = async () => {};
  return <Button onClick={handleTempPost}>暫存按鈕</Button>;
};

export default ScratchBtn;
