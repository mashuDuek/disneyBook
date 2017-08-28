json.extract!(comment, :id, :body, :author_id, :post_id)
json.author comment.author
json.post comment.post
