class AddMoviesToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :movie, :string
  end
end
