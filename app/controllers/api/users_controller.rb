class Api::UsersController < ApplicationController

  def search
    @users = User.where("name ilike '%#{params[:input]}%'")
    render :search
  end

  def create
    @user = User.new(user_params)
    if @user.save!
      login(@user)
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def index
    users_friend_ids = current_user.all_status_friends.map(&:id)
    friends = User.where(id: users_friend_ids)
    receiver_ids = Post.where(receiver_id: friends.map(&:id)).map(&:author_id)
    authored_ids = Post.where(author_id: friends.map(&:id)).map(&:receiver_id)
    friends_of_friends = User.where(id: receiver_ids) + User.where(id: authored_ids)
    users_friend_ids << current_user.id
    all_users = User.where(id: users_friend_ids) + friends_of_friends
    @users = all_users
    render :index
  end

  def show
    @user = User.find(params[:id])
    render :show
  end

  def update
    @user = User.find(params[:id])
    if current_user == @user && @user.update(user_params)
      render :show
    else
      render json: @user.errors.full_messages
    end
  end

  private
  def user_params
    params.require(:user).permit(
      :email, :password, :name, :movie, :id, :cover_pic, :profile_pic
    )
  end
end
