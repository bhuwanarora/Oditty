class WebsiteController < ApplicationController
	def coming_soon
		@image_url = params[:image_url]
		@notice = params[:notice]
		render 'coming_soon', :layout => "coming_soon"
	end

	def random_quote
		@quotes = ComingSoonPageQuotes.all
		render :json => {:quotes => @quotes}, :status => 200
	end

	def email_subscription
		email = params[:subscription][:email]
		existing_user = User.where(:email => email).first
		if existing_user
			if existing_user.is_subscribed
				status = WebsiteStatus::AlreadySubscribed
			else
				existing_user.update_attributes(:is_subscribed => true)
				status = WebsiteStatus::SubscriptionSuccessful
			end
		else
			User.create(:email => email, :is_subscribed => true)
			status = WebsiteStatus::SubscriptionSuccessful
		end
		if status == WebsiteStatus::SubscriptionSuccessful
			name = email.split("@")[0] rescue email
			invitation = {:email => email, :name => name, :template => 'Subscription'}
			SubscriptionMailer.subscribe(invitation).deliver
		end
		redirect_to coming_soon_path(:notice => status)
	end

	def index
	end

	def about
		render :layout => "clean"
	end

	def landing_page
		render :layout => "landing_page"
	end

	def jobs
		render :layout => "clean"
	end

	def privacy
		render :layout => "clean"
	end

	def terms
		render :layout => "clean"
	end

	def advertising
		render :layout => "clean"
	end


	### WEBSITE NEW 
	def home
		@home = true
		render :layout => "material"
	end

	def infinity
		@infinity = true
		render :layout => "material"
	end

	def search
		@search_for = "Terror"
		render :layout => "material"
	end

	def room
		@room = true
		render :layout => "material"
	end

	def book
		@book = true
		render :layout => "material"
	end

	def profile
		render :layout => "material"
	end

	def network
		render :layout => "material"
	end

	def journey
		render :layout => "material"
	end

	def customise
		@customise = true
		render :layout => "material"
	end

	def author
		@author = true
		render :layout => "material"
	end

	def community
		@community = true
		render :layout => "material"
	end

end