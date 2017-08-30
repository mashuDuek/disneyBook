export const SHOW_DROPDOWN = 'SHOW_DROPDOWN';
export const HIDE_DROPDOWN = 'HIDE_DROPDOWN';

export const showDropdown = (component) => {
  debugger
  return {
    type: SHOW_DROPDOWN,
    component: component
  };
};

export const hideDropdown = () => {
  return {
    type: HIDE_DROPDOWN,
  };
};
