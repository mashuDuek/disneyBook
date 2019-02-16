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
  end

  def update
    @friendship = Friendship.find_by(
      friender_id: params[:id],
      friendee_id: current_user.id
    )

    if current_user.id == @friendship.friendee_id && @friendship.update({ status: 'accepted' })
      @user = current_user
      render '/api/users/show'
    else
      render json: @friendship.errors.full_messages, status: 422
    end
  end

  def friendship_params
    params.require(:friendship).permit(:friendee_id)
  end

end
