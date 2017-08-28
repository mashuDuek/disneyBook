class Api::PostsController < ApplicationController

  def create
    @post = Post.new(post_params)
    @post.author_id = current_user.id
    if @post.save!
      render :show
    else
      render json: @post.errors.full_messages, status: 422
    end
  end

  def index
    @posts = Post.includes(:author, comments: :author).all
    render :index
  end

  def update
    @post = Post.find(params[:post][:id])
    if current_user.id == @post.author_id && @post.update(post_params)
      render :show
    else
      render json: @post.errors.full_messages, status: 304
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @posts = Post.includes(:author).all
    if @post.destroy
      render :index
    else
      render json: @post.errors.full_messages, status: 422
    end
  end

  private
  def post_params
    params.require(:post).permit(:body, :receiver_id)
  end
end
