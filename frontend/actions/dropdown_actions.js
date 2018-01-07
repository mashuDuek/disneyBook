export const SHOW_DROPDOWN = 'SHOW_DROPDOWN';
export const HIDE_DROPDOWN = 'HIDE_DROPDOWN';
export const DISPLAY_DROPDOWN = 'DISPLAY_DROPDOWN';

export const showDropdown = (component) => {
  return {
    type: SHOW_DROPDOWN,
    component: component
  };
};

export const displayDropdown = (component) => {
  return {
    type: DISPLAY_DROPDOWN,
    displayed: component
  };
};

export const hideDropdown = () => {
  return {
    type: HIDE_DROPDOWN,
  };
};
