class CreateLikes < ActiveRecord::Migration[5.1]
  def change
    create_table :likes do |t|
      t.integer :liker_id, null: false
      t.integer :post_id
      t.integer :comment_id

      t.timestamps
    end
    add_index :likes, :liker_id
    add_index :likes, :post_id
    add_index :likes, :comment_id
  end
end
