class Api::UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    if @user.save!
      @user.profilePicUrl = "https://i.pinimg.com/736x/10/3c/09/103c097872200038dd538c8f7e56403e--silhouette-mickey-mouse-free-disney-silhouette-cut-files.jpg"
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

  private
  def user_params
    params.require(:user).permit(:email, :password, :name, :movie)
  end

end
