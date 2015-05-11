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

	def webhooks
		email_params = {:email => Constant::EmailTemplate::Admin, :template => Constant::EmailTemplate::Webhooks, :params => params}
		SubscriptionMailer.webhooks(email_params).deliver
		render :json => {:message => "Success"}, :status => 200
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

	def signup
		@signup = true
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
		session[:news_day_skip_count] = 0
		session[:news_skip_count] = 0
		@home = true

		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup' 			
		else
			render :layout => "material" 
		end
	end

	def communities
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def blogs
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def infinity
		@infinity = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def search
		@search = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def room
		@room = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def book
		@book = true
		render :layout => "material"
	end

	def profile
		@profile = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def network
		@network = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def journey
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def customise
		@customise = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def author
		@author = true
		render :layout => "material"
	end

	def community
		@community = true
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirected_to] = request.url
			redirect_to :controller => 'website', :action => 'signup' 			
		else
			render :layout => "material"
		end
	end
end