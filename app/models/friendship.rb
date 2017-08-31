class Friendship < ApplicationRecord
  validates :requestor_id, :acceptor_id, :status presence: true

  belongs_to :friendee,
    foreign_key: :friendee_id,
    class_name: :User

  belongs_to :friender,
    foreign_key: :friender_id,
    class_name: :User

end
