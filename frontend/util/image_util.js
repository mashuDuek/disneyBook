export const updateCover = (image) => {
  return $.ajax({
    method: 'PATCH',
    processData: false,
    contentType: false,
    url: `/api/users/${parseInt(image.get('user[id]'))}`,
    data: image
  });
};
