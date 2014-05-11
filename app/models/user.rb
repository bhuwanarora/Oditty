class User < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	
	attr_accessible :human_profile_id, :email, :is_subscribed
	belongs_to :human_profile
	has_and_belongs_to_many :books
	devise :omniauthable, :omniauth_providers => [:google_oauth2, :facebook]
	has_one :facebook_user_authentication
	has_one :google_user_authentication

	def self.find_for_google_oauth2(access_token, existing_user, signed_in_resource=nil)
	    data = access_token.info
	    if data["email"].present?
		    user = User.find_or_create_by(:email => data["email"], :is_subscribed => true)
	    	google_user_authentication = GoogleUserAuthentication.find_or_create_by(:user_id => user.id)
	    	google_user_authentication.first_name = data.first_name
	    	google_user_authentication.last_name = data.last_name
	    	google_user_authentication.image_url = data.image
	    	google_user_authentication.link = data.urls["Google"]
	    	google_user_authentication.oauth_token = data.to_s
	    	google_user_authentication.save
	    end
	    send_subscription_mail(google_user_authentication.first_name, user.email) unless existing_user
	    user
	end

	def self.find_for_facebook_oauth(auth, existing_user, signed_in_resource=nil)
	    data = auth.extra.raw_info
	    if data["email"].present?
	      	user = User.find_or_create_by(:email => data["email"], :is_subscribed => true)
	      	facebook_user_authentication = FacebookUserAuthentication.find_or_create_by(:user_id => user.id)
		    facebook_user_authentication.uid = auth.uid
		    facebook_user_authentication.access_token = auth.credentials.token
		    facebook_user_authentication.first_name = auth.info.first_name
		    facebook_user_authentication.last_name = auth.info.last_name
		    facebook_user_authentication.image_url = auth.info.image
		    facebook_user_authentication.location_name = auth.info.location
		    facebook_user_authentication.link = auth.info.urls.Facebook
		    facebook_user_authentication.gender = auth.extra.raw_info.gender
		    facebook_user_authentication.oauth_token = auth.to_s
		    facebook_user_authentication.save
	    end
	    # send_subscription_mail(facebook_user_authentication.first_name, user.email) unless existing_user
	    user
	end

	def self.invite(name, email)
		invitation = {:name => name, :email => email, :template => 'Coming Soon'}
		SubscriptionMailer.invite(invitation).deliver
	end

	private
	def self.send_subscription_mail(name, email)
		invitation = {:name => name, :email => email, :template => 'Subscription'}
		SubscriptionMailer.invite(invitation).deliver
	end

	def self.send_invitation_mail(name, email)
		invitation = {:name => name, :email => email, :template => 'Coming Soon'}
		SubscriptionMailer.invite(invitation).deliver
	end

	def post_on_facebook_wall
	    # url = URI.parse("https://graph.facebook.com/"+facebook_user_authentication.uid+"/og.follows?access_token="+
	    # 	facebook_user_authentication.access_token+"&method=POST&profile="+facebook_user_authentication.link)
	    # debugger
	    # url ="https://graph.facebook.com/"+facebook_user_authentication.uid+"/objects/website?access_token="+
	    # facebook_user_authentication.access_token+"&method=POST&"+
	    # "object=%7B%22app_id%22%3A161119590634528%2C%22type%22%3A%22%5C%22website%5C%22%22%2C%22url%22%3A%22%5C%22http%3A%5C%2F%5C%2Fsamples.ogp.me%5C%2F256986074381212%5C%22%22%2C%22title%22%3A%22%5C%22Sample+Website%5C%22%22%2C%22image%22%3A%22%5C%22https%3A%5C%2F%5C%2Fs-static.ak.fbcdn.net%5C%2Fimages%5C%2Fdevsite%5C%2Fattachment_blank.png%5C%22%22%2C%22description%22%3A%22%5C%22%5C%22%22%7D"
	    # response = Net::HTTP.post_form(url, {})
	    # debugger
	end
end