class Api::PostsController < ApplicationController
  before_action :redirect_unless_logged_in

  def create
    @post = Post.new(post_params)
    @post.author_id = current_user.id
    if @post.save
      render "/api/posts"
    else
      render json: @post.errors.full_messages, status: 422
    end
  end

  def index
    @posts = Post.includes(:author).all
    render :index
  end

  def update
    @post = Post.find(params[:id])
    if current_user.id == @post.author_id && @post.update(post_params)
      render "/api/posts"
    else
      render json: @post.errors.full_messages, status: 304
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    render "/api/users/user"
  end

  private
  def post_params
    params.require(:post).permi(:body)
  end
end
