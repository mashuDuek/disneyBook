class Api::CommentsController < ApplicationController

  def create
    @comment = Comment.new(comment_params)
    @comment.author_id = current_user.id
    if @comment.save
      render :show
      # render the posts page, whether it be profile or feed
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  def update
    @comment.find(params[:id])
    if current_user.id == @comment.author_id && @comment.update(comment_params)
      render :show
    else
      render json: @comment.errors.full_messages, status: 304
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    if @comment.destroy
      render :show
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  private
  def comment_params
    params.require(:comment).permit(:body, :post_id)
  end
end
