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

	def data_analytics
		@title = "Data Analytics at Oditty | In Data We Trust."
		render :layout => "material_clean"
	end

	def webhooks
		email_params = {:email => Constant::EmailTemplate::Admin, 
				:template => Constant::EmailTemplate::Webhooks, 
				:params => params}
		SubscriptionMailer.webhooks(email_params).deliver
		render :json => {:message => "Success"}, :status => 200
	end

	def products
		@products = true
		@title = "Aiming to assimilate All Human Knowledge | Oditty Products"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Aiming to assimilate All Human Knowledge | Oditty Products", "description" => "Aiming to assimilate All Human Knowledge", "description" => "My Smart and Social Knowledge Discovery Platform for News, Books, and Videos", "image_url" => "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12036689_488803224623886_4162488278945721496_n.jpg?oh=34ec62c9bb7ec5d56df5f5163fee6959&oe=566A6C86&__gda__=1453697292_192dd1a4bea6148336fa02317b722422"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	def journey
		@journey = true
		@title = "Our Journey So Far | Oditty"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Our Journey So Far | Oditty", "description" => "My Smart and Social Knowledge Discovery Platform for News, Books, and Videos", "image_url" => "https://oditty.me/assets/journey.png"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	def utilities
		@redirect_url = params[:url]
		render :layout => "material_clean"
	end

	def games
		@games = true
		@title = "Judge a Book by its cover | Games on Oditty"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Judge a Book by its cover #Addictive #PlayNow", "meta_type" => "Game", "image_url" => "https://oditty.me/assets/gamescover.png"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	def ads
		@ads = true
		@title = "Create an Advertisement | Oditty"
		render :layout => "material"
	end

	def testimonials
		@testimonials = true
		@title = "Share your feedback | Oditty Feedbacks"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Share your feedback | Oditty Feedbacks", "image_url" => "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12036689_488803224623886_4162488278945721496_n.jpg?oh=34ec62c9bb7ec5d56df5f5163fee6959&oe=566A6C86&__gda__=1453697292_192dd1a4bea6148336fa02317b722422", "description" => "Share your feedback | Oditty Feedbacks"}
			render :layout => "social"
		else
			render :layout => "material"
		end
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

	def quiz
		@quiz = true
		@title = "Discover yourself through Oditty Quizzes"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Discover yourself through Oditty Quizzes", "meta_type" => "Quiz", "image_url" => "http://oditty.me/assets/quiz.png", "description" => "Quizzes are for fun. #OdittyQuizzes"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	def spaces
		@spaces = true
		@title = "Feed from my social circle | Oditty Spaces"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Feed from my social circle | Oditty Spaces", "description" => "Spaces are your social feed.",  "image_url" => "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12036689_488803224623886_4162488278945721496_n.jpg?oh=34ec62c9bb7ec5d56df5f5163fee6959&oe=566A6C86&__gda__=1453697292_192dd1a4bea6148336fa02317b722422"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	def index
	end

	def vision
		render :layout => "material_clean"
	end

	def about
		@title = "About Oditty | Social network for Bibliophiles"
		render :layout => "material_clean"
	end

	def work
		@title = "Work at Oditty | Be the part of our Vision"
		render :layout => "material_clean"
	end

	def how_it_works
		render :layout => "landing_page"
	end

	def signup
		cookies.delete :user
		cookies.delete :logged
		session.clear
		@signup = true
		render :products, :layout => "material"
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


	def news_feed_rooms
		@title = "Stay Updated with News in Rooms I care about | Oditty News"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Stay Updated with News in Rooms I care about | Oditty News", "description" => "Aiming to assimilate All Human Knowledge", "description" => "My Smart and Social Knowledge Discovery Platform for News, Books, and Videos", "image_url" => "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12036689_488803224623886_4162488278945721496_n.jpg?oh=34ec62c9bb7ec5d56df5f5163fee6959&oe=566A6C86&__gda__=1453697292_192dd1a4bea6148336fa02317b722422"}
			render :layout => "social"
		else
			session[:news_day_skip_count] = 0
			session[:news_skip_count] = 0
			@news_group = true
			render :layout => "material"	
		end
		
	end

	### WEBSITE NEW 
	def news_group
		news_feed_rooms
	end

	def browse
		@browse = true
		@title = "Rooms of Knowledge, Oditty | #OditRooms"
		render :layout => "material"
	end

	def communities
		news_feed_rooms
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

	def books
		@books = true
		@title = "Filter books depending on your taste | Oditty Books"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "Filter books depending on your taste | Oditty Books", "description" => "Aiming to assimilate All Human Knowledge", "description" => "My Smart and Social Knowledge Discovery Platform for News, Books, and Videos", "image_url" => "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12036689_488803224623886_4162488278945721496_n.jpg?oh=34ec62c9bb7ec5d56df5f5163fee6959&oe=566A6C86&__gda__=1453697292_192dd1a4bea6148336fa02317b722422"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	def search
		@search = true
		@title = "Oditty Search"
		render :layout => "material"
	end

	def news_shelves
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@shelves = true
			render :layout => "material"
		end
	end

	def books_shelves

	end

	def book
		@book = true
		puts "in book".green
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			id = params[:q] || params[:id]
			puts "bot_incoming".red
			@info = Book.new(id).get_basic_info.execute[0]
			@info["original_url"] = request.original_url
			@info["title"] = @info['title'] + " by " + @info['author_name'] + ", Oditty"
			@info["meta_type"] = "book"
			if @info["isbn"]
				@info["image_url"] = "http://rd-images.readersdoor.netdna-cdn.com/" + @info["isbn"].split(",").first + "/M.jpg";
			else
				@info["image_url"] = "https://scontent-cdg.xx.fbcdn.net/hphotos-xpf1/t31.0-8/10958828_401228046714738_8995198285620261747_o.jpg";
			end
			@info["description"] ||= "Discovering me through News, Books and Videos."
			render :layout => "social"
		else
			user_id = session[:user_id]
			render :layout => "material"
		end
	end

	def authors
		@authors = true
		@title = "Authors on Oditty | Authors Interviewed"
		render :layout => "material"
	end

	def profile
		@profile = true
		render :layout => "material"
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
			@info["meta_type"] = "oditty:author"
			@info["title"] = @info["name"] + ", Oditty"
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
			@info["description"] = "Discovering me through News, Books and Videos."
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
			@info["meta_type"] = "oditty:news"
			@info["title"] = @info["title"] + ", Oditty"
			@info["original_url"] = request.original_url
			render :layout => "social"
		else
			user_id = session[:user_id]
			render :layout => "material"
		end	
	end

	def personalised_suggestions
		unless session[:user_id]
			cookies[:logged] = nil
			cookies[:redirect_url] = request.original_fullpath.gsub!("/", "")
			redirect_to :controller => 'website', :action => 'signup'			
		else
			@personalised_suggestions = true
			render :layout => "material"
		end
	end

	def test
		render :layout => "material_home"
	end

	def home
		@products = true
		render :test, :layout => "material_home"
	end

	def rooms
		@rooms = true
		@title = "News, Videos and Books on a particular topic | Oditty Rooms"
		if BotDetector.detect request.env['HTTP_USER_AGENT']
			@info = {"title" => "News, Videos and Books on a particular topic | Oditty Rooms", "description" => "Aiming to assimilate All Human Knowledge", "description" => "My Smart and Social Knowledge Discovery Platform for News, Books, and Videos", "image_url" => "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12036689_488803224623886_4162488278945721496_n.jpg?oh=34ec62c9bb7ec5d56df5f5163fee6959&oe=566A6C86&__gda__=1453697292_192dd1a4bea6148336fa02317b722422"}
			render :layout => "social"
		else
			render :layout => "material"
		end
	end

	# def home
	# 	@home = true
	# 	render :layout => "material_home"
	# end

	def publishers
		@publishers = true
		render :layout => "material"
	end

	def help
		render :layout => "material_clean"
	end

end