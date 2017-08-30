class AddCoverPhotosToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :cover_url, :string
  end
end
