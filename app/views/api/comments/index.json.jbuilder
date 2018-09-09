# json.comments @comments, partial: 'api/comments/comment', as: :comment
json.comments do
  @comments.each do |comment|
    json.set! comment.id do
      json.partial! 'api/comments/comment', comment: comment
    end
  end
end

if @users
  json.users do
    @users.each do |user|
      json.set! user.id do
        json.partial! 'api/users/user', user: user
      end
    end
  end
end
