class Api::FriendshipsController < ApplicationController

  def create
    @friendship = Friendship.new(friendship_params)
    @friendship.friender_id = current_user.id
    if @friendship.save
      @user = current_user
      render '/api/users/show'
    else
      render json: @friendship.errors.full_messages, status: 422
    end
  end

  def destroy
    @friendship.find(params[:id])
    @friendship.destroy
    # render :index
    # ??
  end

  def update
    @friendship = Friendship.find(params[:id])
    if current_user.id == @friendship.friendee_id && @friendship.update(friendship_params)
      # if you update to reject, I delete the "friendship".
      # should i set status in here to accepted ?
      # render :index
      # ??
    else
      render json: @friendship.errors.full_messages, status: 422
    end
  end

  def friendship_params
    params.require(:friendship).permit(:friendee_id)
  end

end
