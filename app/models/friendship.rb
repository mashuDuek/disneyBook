class Friendship < ApplicationRecord
  validates :requestor_id, :acceptor_id, :status presence: true

end
