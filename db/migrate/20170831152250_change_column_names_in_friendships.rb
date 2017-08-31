class ChangeColumnNamesInFriendships < ActiveRecord::Migration[5.1]
  def change
    rename_column :friendships, :requestor_id, :friendee_id
    rename_column :friendships, :acceptor_id, :friender_id
  end
end
