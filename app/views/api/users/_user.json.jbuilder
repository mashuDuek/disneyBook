json.id user.id
json.name user.name
json.profilePic asset_path(user.profile_pic.url)
json.coverPic asset_path(user.cover_pic.url)
json.movie user.movie
json.email user.email
json.pendingFriendIds user.pending_friends.pluck(:id)
json.acceptedFriends user.accepted_friends.pluck(:id)

# json.acceptedFriends do
#   user.accepted_friends.each do |friend|
#     json.set! friend.id do
#       json.id friend.id
#       json.name friend.name
#       json.movie friend.movie
#       json.profilePic asset_path(friend.profile_pic.url)
#       json.coverPic asset_path(friend.cover_pic.url)
#     end
#   end
# end

# json.pendingFriendIds do
  # user.pending_friends.each do |friend|
  #   json.set! friend.id do
  #     json.id friend.id
  #     json.name friend.name
  #     json.movie friend.movie
  #     json.profilePic asset_path(friend.profile_pic.url)
  #     json.coverPic asset_path(friend.cover_pic.url)
  #   end
  # end
# end
