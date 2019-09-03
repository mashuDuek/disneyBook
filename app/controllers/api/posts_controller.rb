class Api::PostsController < ApplicationController

  def create
    @post = current_user.posts.new(post_params)
    if @post.save
      render :show
    else
      render json: @post.errors.full_messages, status: 422
    end
  end

  def show
    @post = Post.find(params[:id])
    render :show
  end

  def index
    ids = current_user.all_status_friends.ids + [current_user.id]
    posts = Post.where(author_id: ids) + Post.where(receiver_id: ids)
    posts.sort_by! { |p| p.created_at }
    @posts = posts.uniq
    post_ids = @posts.map(&:receiver_id) + @posts.map(&:author_id)
    @users = User.where(id: post_ids)
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
    if @post.destroy
      render :show
    else
      render json: @post.errors.full_messages, status: 422
    end
  end

  private
  def post_params
    params.require(:post).permit(:body, :receiver_id)
  end
end
