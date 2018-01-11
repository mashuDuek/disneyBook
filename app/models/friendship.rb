# == Schema Information
#
# Table name: friendships
#
#  id          :integer          not null, primary key
#  friendee_id :integer          not null
#  friender_id :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  status      :string           default("pending"), not null
#
# Indexes
#
#  index_friendships_on_friendee_id                  (friendee_id)
#  index_friendships_on_friendee_id_and_friender_id  (friendee_id,friender_id) UNIQUE
#  index_friendships_on_friender_id                  (friender_id)
#

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
