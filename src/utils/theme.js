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

export const styledListTitle = {
  padding: '1.25rem 0.875rem',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: color.textColor,
};
export default color;
