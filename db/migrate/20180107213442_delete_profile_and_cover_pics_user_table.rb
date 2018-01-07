class DeleteProfileAndCoverPicsUserTable < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :cover_url
    remove_column :users, :profilePicUrl 
  end
end
