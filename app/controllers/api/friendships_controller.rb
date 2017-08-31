class Api::FriendshipsController < ApplicationController

  def create
    @friendship = @Friendship.new(friendship_params)
    @friendship.friendee_id = current_user.id
    if @friendship.save
      render :index
    else
      render json: @friendship.errors.full_messages, status: 422
    end
  end

  def destroy
    @friendship.find(params[:id])
    @friendship.destroy
  end

  def update
    @friendship = Friendship.find(params[:id])
    if current_user.id === @friendship.friendee_id && @friendship.update(friendship_params)
      render :index
    else
      render json: @friendship.errors.full_messages, status: 422
    end
  end

  def friendship_params
    params.require(:friendship).permit(:friender_id)
  end

end
