accepted_friend_ids = user.accepted_friends.pluck(:id)
json.extract! user, :id, :name, :movie, :email
json.profilePic asset_path(user.profile_pic.url)
json.coverPic asset_path(user.cover_pic.url)
json.pendingFriendIds user.pending_friends.pluck(:id)
json.acceptedFriendIds accepted_friend_ids
json.currentUserIsFriend accepted_friend_ids.include?(current_user.id)