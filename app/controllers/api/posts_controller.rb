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

  def show
    @post = Post.find(params[:id])
    render :show
  end

  def index
    ids = current_user.accepted_friends.map(&:id)
    ids << current_user.id
    good_posts = Post.where(author_id: ids) + Post.where(receiver_id: ids)
    @posts = good_posts.uniq
    render :index
  end
  # query buildup for posts - beauty of active record
  # select posts.* from posts
  # join users on users.id = posts.author_id
  # where users.id in (
  #   select users.id from users where users.name = 'Mufasa'
  # )
  #   or users.id in (
  #     select distinct(users.id) from users
  #     join friendships on (friendships.friendee_id = users.id or friendships.friender_id = users.id)
  #     where friendships.friender_id in (
  #       select users.id from users where users.name = 'Mufasa'
  #     ) or friendships.friendee_id in (
  #       select users.id from users where users.name = 'Mufasa'
  #     )
  #   )

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
