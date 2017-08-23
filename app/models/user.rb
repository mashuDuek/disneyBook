class User < ApplicationRecord
  validates :session_token, :password_digest, :email, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}

  has_many :posts,
    foreign_key: :author_id,
    primary_key: :id,
    class_name: :Post

  attr_reader :password

  after_initialize :ensure_session_token

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
