class CreateFriends < ActiveRecord::Migration[5.1]
  def change
    create_table :friends do |t|
      t.integer :requestor_id, null: false
      t.integer :acceptor_id, null: false

      t.timestamps
    end

    add_index :friends, :requestor_id
    add_index :friends, :acceptor_id
  end
end
