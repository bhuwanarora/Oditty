class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery
  
  before_filter :check_permission

  after_filter :set_csrf_cookie_for_ng

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def check_permission
    # session[:user_id] = nil
    unless ($redis.get 'book_ids').present?
      $redis.set 'book_ids', ""
    end
    # private_access = ["panel/labels", "freebase", "freebase_search", "freebase_resource", "trends", "users", "grids", "panel/thumbs", "delete_grid", "add_grid", "update_grid"]
    # unaccessible_page = private_access.include? params[:action]
    # debugger
    # if unaccessible_page
    #   email = session[:email]
    #   # email = "bhuwanarora67@gmail.com"
    #   valid_admin = ReadersDoorAdmin.pluck(:email).include? email
    #   if valid_admin
    #     @user = User.where(:email => email).first
    #   else
    #     redirect_to "#{Rails.application.config.home}"
    #   end
    # end
  end

  protected

  def verified_request?
    super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
  end

end