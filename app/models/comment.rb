class Comment < ApplicationRecord
  validates :body, :post, :author, presence: true

  belongs_to :author,
    foreign_key: :author_id,
    primary_key: :id,
    class_name: :User

  belongs_to :post,
    foreign_key: :post_id,
    primary_key: :id,
    class_name: :Post 
end
