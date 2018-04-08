class AddUniquenessToPostsWithCommentsAndPosts < ActiveRecord::Migration[5.1]
  def change
    add_index :likes, [:liker_id, :post_id], unique: true
    add_index :likes, [:liker_id, :comment_id], unique: true
  end
end
