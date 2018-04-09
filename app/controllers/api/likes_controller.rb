class Api::LikesController < ApplicationController

  def create
    if params[:post]
      @like = Like.new(post_id: params[:post][:id], liker_id: current_user.id)
      if @like.save!
        render :show
      else
        render json: @user.errors.full_messages, status: 422
      end
    elsif params[:comment]
      @like = Like.new(comment_id: params[:comment][:id], liker_id: current_user.id)
      if @like.save!
        render :show
      else
        render json: @user.errors.full_messages, status: 422
      end
    end
  end

  def index
    @likes = Like.all
  end

  def destroy
    @like = Like.find_by(post_id: params[:post_id], liker_id: current_user.id)
    @like.destroy
    render :show
  end
end
