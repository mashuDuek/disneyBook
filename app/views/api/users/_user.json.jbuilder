json.id user.id
json.name user.name
json.profilePic asset_path(user.profile_pic.url)
json.coverPic asset_path(user.cover_pic.url)
json.movie user.movie
json.email user.email
json.pendingFriendIds user.pending_friends.map(&:id)
json.acceptedFriendIds user.accepted_friends.map(&:id)