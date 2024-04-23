export const screen = {
  desktop: '1280px',
  mobile: '350px',
};

const color = {
  primary: '#417000',
  secondary: '#8b572a',
  textColor: '#4f4f4f',
  mainBackgound: '#eeeeee',
  borderColor: '#d9d9d9',
  lightBackgroundColor: '#fafafa',
};

export const textBorder = {
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${color.borderColor}`,
  padding: `4px 12px`,
  backgroundColor: `#fff`,
};

export const fieldWrapper = {
  width: '90%',
  position: 'relative',
  marginBottom: '1rem',
};

export const inputFocusStyle = {
  outline: 'none !important',
  border: `1px solid ${color.secondary}`,
  boxShadow: `0 0 6px ${color.secondary}`,
};
export default color;
