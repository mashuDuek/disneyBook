json.partial! 'api/users/user', user: @user

if @users
  json.users do
    @users.each do |user|
      json.partial! 'api/users/user', user: user
    end
  end
end
