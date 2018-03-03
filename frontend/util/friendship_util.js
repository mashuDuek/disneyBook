export const createFriendship = (user) => {
  return $.ajax({
    method: "POST",
    url: '/api/friendships',
    data: user
  });
};

export const rejectFriendship = (user) => {
  return $.ajax({
    method: "DELETE",
    url: `/api/friendships/${user.id}`
  });
};

export const acceptFriendship = (user) => {
  return $.ajax({
      method: "PATCH",
      url: `/api/friendships/${user.id}`,
      data: {
        friendship: {
          friendee_id: user.id
        }
      }
  });
};
