class ChangeTableNameFriends < ActiveRecord::Migration[5.1]
  def change
    rename_table :friends, :friendships 
  end
end
