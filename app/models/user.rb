class User < ApplicationRecord
  validates :session_token, :password_digest, :email, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}

  has_many :posts,
    foreign_key: :author_id,
    primary_key: :id,
    class_name: :Post

  has_many :received_friend_requests,
    foreign_key: :friendee_id,
    class_name: :Friendship

  has_many :sent_friend_requests,
    foreign_key: :friender_id,
    class_name: :Friendship

  has_many :requested_friends,
    through: :sent_friend_requests,
    source: :friendee

  has_many :received_friends,
    through: :received_friend_requests,
    source: :friender

  attr_reader :password

  after_initialize :ensure_session_token

  def all_status_friends
    all_friendships = <<-SQL
      JOIN friendships
      ON friendships.friender_id = users.id OR friendships.friendee_id = users.id
    SQL

    # join_friends = <<-SQL
    #   JOIN
    #     users AS friends
    #   ON
    #     friends.id = friendships.friender_id OR friends.id = friendships.friendee_id
    # SQL

    # .select("friends.*")
    # .joins(join_friends)
    User
      .joins(all_friendships)
      .where("users.id != ? AND (friendships.friender_id = ? OR friendships.friendee_id = ?)", id, id, id)
    # User.find_by_sql(<<-SQL)
    #   SELECT friends.*
    #   FROM users
    #   JOIN friendships on friendships.friender_id = #{self.id} or friendships.friendee_id = #{self.id}
    #   JOIN users as friends on friends.id = friendships.friender_id or friends.id = friendships.friendee_id
    #   WHERE friends.id != #{self.id} and users.id = #{self.id}
    # SQL
  end

  def accepted_friends
    all_status_friends.where(friendships: { status: 'accepted' })
  end

  def pending_friends
    all_status_friends.where(friendships: { status: 'pending' })
  end

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    user && user.is_password?(password) ? user : nil
  end

  def self.generate_session_token
    SecureRandom.urlsafe_base64
  end

  def reset_session_token
    self.session_token = User.generate_session_token
    self.save!
    self.session_token
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end

end
