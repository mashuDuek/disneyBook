json.extract!(post, :id, :body, :author_id, :receiver_id)
json.likes post.likes.map(&:id)
json.comments post.comments.map(&:id)

json.author do
  json.id post.author.id
  json.name post.author.name
  json.email post.author.email
  json.profilePic asset_path(post.author.profile_pic.url)
  json.coverPic asset_path(post.author.cover_pic.url)
end
