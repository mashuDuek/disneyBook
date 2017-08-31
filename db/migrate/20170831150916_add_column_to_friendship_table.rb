class AddColumnToFriendshipTable < ActiveRecord::Migration[5.1]
  def change
    add_column :friendships, :status, :string, null: false
  end
end
