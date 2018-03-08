json.extract!(comment, :id, :body, :author_id, :post_id)
json.post comment.post

json.author do
  json.id comment.author.id
  json.name comment.author.name
  json.email comment.author.email
  json.profilePic asset_path(comment.author.profile_pic.url)
  json.coverPic asset_path(comment.author.cover_pic.url)
end
