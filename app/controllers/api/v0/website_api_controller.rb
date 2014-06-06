module Api
	module V0
		class WebsiteApiController < ApplicationController
			def genres
                @neo ||= neo_init
				filter = params[:q]
                genres = SearchApi.search_genres filter
                
				results = {:genres => genres}
				render :json => results, :status => 200
			end

			def countries
				filter = params[:q]
				results = {:countries => CountryGroup.all}
				render :json => results, :status => 200
			end

            def labels
                labels = WebsiteApi.get_labels
                results = {:labels => labels}
                render :json => results, :status => 200
            end

            def times
                time_groups = WebsiteApi.get_time_groups
                results = {:times => time_groups}
                render :json => results, :status => 200
            end

            def read_times
                results = {:read_times => ReadTime.all}
                render :json => results, :status => 200
            end

			def get_user_details
				# user_id = params[:user_id]
				
				bookmarked_books = BookApi.bookmarked_books
				read_books = []
				render :json => {:books => {:bookmarked => bookmarked_books, :read => read_books}}, :status => 200
			end

			def authenticate
				render :json => {:message => "success", :profile_status => 0, :user_id => 1}, :status => 200
			end

			def update_profile
				profile_status = params[:user['profile_status']]
				profile_status = profile_status + 1;
				render :json => {:message => "success", :profile_status => profile_status, :user_id => 1}, :status => 200
			end

			def image
				image_url = SearchPage.all(:order => "RANDOM()").first.background_image_url
				render :json => {:url => image_url}, :status => 200
			end

			def notifications
				notifications = [
					{
						:thumb => "assets/profile_pic.jpeg",
						:user => "",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User1</a> added book <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test Book2</a> to his <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>reading shelf</a>, and gave 4 rating to the book.",
						:timestamp => "2 days ago",
						:category_id => 1
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User4</a> recommended you <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test-BookA</a> by <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test-AuthorB.</a>",
						:timestamp => "3 days ago",
						:category_id => 2
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a>, <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 4</a> read <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test book A</a> recommended by <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 2.</a>",
						:timestamp => "4 days ago",
						:category_id => 3
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 4</a> wrote a <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>review on Test-BookA.</a>",
						:description => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>A well written concise life story of Siddhartha...</a>",
						:timestamp => "2 days ago",
						:category_id => 4
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a> bookmarked <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>test book</a> for later viewing.",
						:timestamp => "2 days ago",
						:category_id => 5
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a> from Facebook joined Reader's Door. <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Follow</a> him.",
						:timestamp => "2 days ago",
						:category_id => 6
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a> from Facebook joined Reader's Door. <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Follow</a> him.",
						:timestamp => "2 days ago",
						:category_id => 7
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						               	ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a> started following you. <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Follow</a> him.",
						:timestamp => "2 days ago",
						:category_id => 8
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						               	ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a>, <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 2</a> tagged <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>TestUser4</a> as Tag.",
						:timestamp => "2 days ago",
						:category_id => 9
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "<a href='javascript:void(0);'
						                ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 1</a>, <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>Test User 2</a> started following <a href='javascript:void(0);'
                     					ns-popover
     									ns-popover-template='popover'
     									ns-popover-trigger='mouseover'
     									ns-popover-timeout='0'
     									ns-popover-placement='bottom|right'>TestUser4</a>.",
						:timestamp => "2 days ago",
						:category_id => 10
					}
				]
				render :json => {:notifications => notifications}, :status => 200
			end

            private
            def neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end