json.extract!(post, :id, :body, :author_id, :receiver_id)
json.comments do
  json.array! post.comments, partial: 'api/comments/comment', as: :comment
end
json.author post.author
