@users.each do |user|
  json.set! user.id do
    json.partial! 'user', user: user
  end
end

json.searchedIds @users.ids 
