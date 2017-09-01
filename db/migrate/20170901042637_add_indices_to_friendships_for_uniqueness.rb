class AddIndicesToFriendshipsForUniqueness < ActiveRecord::Migration[5.1]
  def change
    add_index :friendships, [:friendee_id, :friender_id], unique: true

  end
end
