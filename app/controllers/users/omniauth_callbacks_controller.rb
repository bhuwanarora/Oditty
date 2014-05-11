class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    auth = request.env["omniauth.auth"]
    user = User.where(:email => auth["info"]["email"]).first
    existing_user = user.present?
    status = WebsiteStatus::AlreadySubscribed if existing_user && user.is_subscribed
    @user = User.find_for_google_oauth2(auth, user.is_subscribed, current_user)
    if @user.email.present? && @user.persisted?
      session[:email] = @user.email
      status = WebsiteStatus::SubscriptionSuccessful unless status
      redirect_to coming_soon_path(:notice => status, 
                                  :image_url => @user.google_user_authentication.image_url)
    else
      session[:email] = nil
      status = WebsiteStatus::SubscriptionSuccessful unless status
      redirect_to coming_soon_path(:notice => status)
    end
  end

  def passthru    
    render :status => 404, :text => "Invalid redirection."
  end 

  def facebook
    auth = request.env["omniauth.auth"]
    user = User.where(:email => auth["info"]["email"]).first
    existing_user = user.present?
    status = WebsiteStatus::AlreadySubscribed if existing_user && user.is_subscribed
    @user = User.find_for_facebook_oauth(auth, user.is_subscribed, current_user)
    if @user.email.present? && @user.persisted?
      session[:email] = @user.email
      status = WebsiteStatus::SubscriptionSuccessful unless status
      facebook_pages = FacebooksHelper.get_facebook_pages(@user.id)
      redirect_to new_facebook_path(:facebook_pages => facebook_pages.as_json)
      # redirect_to coming_soon_path(:notice => status, 
                                  # :image_url => @user.facebook_user_authentication.image_url)
    else
      session[:email] = nil
      status = WebsiteStatus::SubscriptionSuccessful unless status
      redirect_to new_facebook_path
      # redirect_to coming_soon_path(:notice => status)
    end
  end

end
