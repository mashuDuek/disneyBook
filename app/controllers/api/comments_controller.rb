class Api::CommentsController < ApplicationController

  def create
    @comment = Comment.new(comment_params)
    @comment.author_id = current_user.id
    if @comment.save
      render :show
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  def index
    ids = current_user.accepted_friends.map(&:id)
    ids << current_user.id
    posts = Post.where(author_id: ids) + Post.where(receiver_id: ids)
    # Comment.where(author_id: ids)
    @comments = Comment.where(post_id: posts.map(&:id))
    @users = User.where(id: @comments.map(&:author_id))
    render :index
  end

  def update
    @comment = Comment.find(params[:comment][:id])
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
