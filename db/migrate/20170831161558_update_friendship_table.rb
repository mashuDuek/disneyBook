class UpdateFriendshipTable < ActiveRecord::Migration[5.1]
  def change
    change_column :friendships, :status, :string, default: "pending", null: false
  end
end
