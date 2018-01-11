class Api::UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    if @user.save!

      # delete these and fugure out what goes instead

      # @user.profilePicUrl = "https://i.pinimg.com/736x/10/3c/09/103c097872200038dd538c8f7e56403e--silhouette-mickey-mouse-free-disney-silhouette-cut-files.jpg"
      # @user.cover_url = "https://i.pinimg.com/originals/77/a7/e3/77a7e37f42d25404191efc8ca82f5842.jpg"

      login(@user)
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def index
    @users = User.all
    render :index
  end

  def show
    @user = User.find(params[:id])
    render :show
  end

  def update
    debugger
    @user = User.find(params[:id])
    if current_user == @user && @user.update(user_params)
      render :show
    else
      render json: @user.errors.full_messages
    end
  end

  private
  def user_params
    debugger
    params.require(:user).permit(:email, :password, :name, :movie)
  end

end
