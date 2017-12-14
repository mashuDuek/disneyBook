class Friendship < ApplicationRecord
  validates :friendee, :requester, :status, presence: true
  validates :status, inclusion: { in: ['pending', 'accepted', 'rejected'] }

  belongs_to :friendee,
    foreign_key: :friendee_id,
    class_name: :User

  belongs_to :requester,
    foreign_key: :friender_id,
    class_name: :User

end
