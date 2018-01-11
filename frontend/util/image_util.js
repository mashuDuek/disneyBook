export const updateCover = (image) => {
  debugger
  return $.ajax({
    method: 'PATCH',
    processData: false,
    contentType: false,
    url: '/api/users',
    data: image
  });
};
