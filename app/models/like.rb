# == Schema Information
#
# Table name: likes
#
#  id         :integer          not null, primary key
#  liker_id   :integer          not null
#  post_id    :integer
#  comment_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_likes_on_comment_id               (comment_id)
#  index_likes_on_liker_id                 (liker_id)
#  index_likes_on_liker_id_and_comment_id  (liker_id,comment_id) UNIQUE
#  index_likes_on_liker_id_and_post_id     (liker_id,post_id) UNIQUE
#  index_likes_on_post_id                  (post_id)
#

class Like < ApplicationRecord
  validates :liker, presence: true

  belongs_to :liker,
    foreign_key: :liker_id,
    primary_key: :id,
    class_name: :User

  belongs_to :comment,
    foreign_key: :comment_id,
    primary_key: :id,
    class_name: :Comment,
    optional: true

  belongs_to :post,
    foreign_key: :post_id,
    primary_key: :id,
    class_name: :Post,
    optional: true
end
