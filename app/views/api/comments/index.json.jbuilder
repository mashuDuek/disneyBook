# json.comments @comments, partial: 'api/comments/comment', as: :comment
@comments.each do |comment|
  json.set! comment.id do
    json.partial! 'api/comments/comment', comment: comment
  end
end
