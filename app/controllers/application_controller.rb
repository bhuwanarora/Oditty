class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery
  
  before_filter :check_permission

  after_filter :set_csrf_cookie_for_angular

  def set_csrf_cookie_for_angular
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def check_permission
    session["init"] = true
   if Constant::Id::Admin.include? session[:user_id]
      @is_admin = true
   end
    puts "check_permission is_admin #{@is_admin} user_id #{session[:user_id]}".green
  end

  protected

  def verified_request?
    super || (form_authenticity_token == request.headers['X-XSRF-TOKEN'])
  end

end 
