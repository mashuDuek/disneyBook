json.extract! user, :id, :name, :movie, :email
json.profilePic asset_path(user.profile_pic.url)
json.coverPic asset_path(user.cover_pic.url)
json.pendingFriendIds user.pending_friends.pluck(:id)
json.acceptedFriendIds user.accepted_friends.pluck(:id)