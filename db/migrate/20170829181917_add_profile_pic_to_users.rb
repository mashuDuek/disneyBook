class AddProfilePicToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :profilePicUrl, :string
  end
end
