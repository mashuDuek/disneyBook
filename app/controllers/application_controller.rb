class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :redirect_unless_logged_in, :logged_in?

  def current_user
    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def logged_in?
    !!current_user
  end

  def login(user)
    session[:session_token] = user.reset_session_token
  end

  def logout
    current_user.reset_session_token
    session[:session_token] = nil
  end

  def redirect_unless_logged_in
    redirect_to '/api/session' unless logged_in?
  end

end
