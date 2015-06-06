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

	def how_it_works
		render :layout => "landing_page"
	end

	def signup
		cookies.delete :user
		cookies.delete :logged
		session.clear
		@signup = true
		render :home, :layout => "material"
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
	def news_group
		session[:news_day_skip_count] = 0
		session[:news_skip_count] = 0

		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup' 			
		else
			@news_group = true
			render :layout => "material" 
		end
	end

	def communities
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@news_group = true
			render :layout => "material"
		end
	end

	def blogs
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@blogs = true
			@news_group = true
			render :layout => "material"
		end
	end

	def infinity
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@infinity = true
			render :layout => "material"
		end
	end

	def search
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@search = true
			render :layout => "material"
		end
	end

	def shelves
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@shelves = true
			render :layout => "material"
		end
	end

	def book
		@book = true
		puts "in book".green
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			id = params[:q] || params[:id]
			puts "bot_incoming".red
			@info = Book.new(id).get_basic_info.execute[0]
			@info["original_url"] = request.original_url
			@info["title"] = @info['title'] + " by " + @info['author_name'] + ", ReadersDoor"
			@info["meta_type"] = "book"
			if @info["isbn"]
				@info["image_url"] = "http://rd-images.readersdoor.netdna-cdn.com/" + @info["isbn"].split(",").first + "/M.jpg";
			else
				@info["image_url"] = "https://scontent-cdg.xx.fbcdn.net/hphotos-xpf1/t31.0-8/10958828_401228046714738_8995198285620261747_o.jpg";
			end
			render :layout => "social"
		else
			user_id = session[:user_id]
			render :layout => "material"
		end
	end

	def profile
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@profile = true
			render :layout => "material"
		end
	end

	def network
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@network = true
			render :layout => "material"
		end
	end

	def journey
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			render :layout => "material"
		end
	end

	def customise
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@customise = true
			render :layout => "material"
		end
	end

	def author
		@author = true
		if BotDetector.detect(request.env['HTTP_USER_AGENT'])
			author_id = params[:q] || params[:id]
			user_id = nil
			puts "bot_incoming".red
			@info = Author.new(author_id).get_basic_info.execute[0]
			@info["meta_type"] = "readersdoor:author"
			@info["title"] = @info["name"] + ", ReadersDoor"
			@info["original_url"] = request.original_url
			@info["image_url"] = "http://rd-authors.readersdoor.netdna-cdn.com/" + @info["id"].to_s + "/M.png"
			render :layout => "social"
		else
			user_id = session[:user_id]
			render :layout => "material"
		end
	end

	def room
		@room = true
		if BotDetector.detect(request.env['HTTP_USER_AGENT'])
			id = params[:id] || params[:q]
			@info = Community.new(id).get_basic_info.execute[0]
			render :layout => "social"
		else
			user_id = session[:user_id]
			render :layout => "material"
		end
	end

	def news
		@news = true
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			id = params[:q] || params[:id]
			puts "bot_incoming".red
			@info = News.new(id).get_basic_info.execute[0]
			@info["meta_type"] = "readersdoor:news"
			@info["title"] = @info["title"] + ", ReadersDoor"
			@info["original_url"] = request.original_url
			render :layout => "social"
		else
			user_id = session[:user_id]
			render :layout => "material"
		end	
	end

	def personalised_suggestions
		@personalised_suggestions = true
		render :layout => "material"
	end

	def home
		@home = true
		render :layout => "material"
	end

	def publishers
		@publishers = true
		render :layout => "material"
	end

	def help
		render :layout => "material_clean"
	end

end