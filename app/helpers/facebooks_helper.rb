module FacebooksHelper
	require 'fb_graph'

	def self.get_facebook_pages user_id
		access_token = FacebookUserAuthentication.where(:user_id => user_id).first.access_token
 		# page = FbGraph::Page.new('FbGraph').fetch(:access_token => access_token, :fields => :access_token)
 		me = FbGraph::User.me(access_token)
 		page = me.accounts.detect do |p|
			p.name == "Reader's Door"
		end
		post page
		pages = me.accounts
		pages
	end

	def self.post page
		page.feed!(
		 	:message => 'TEST MESSAGE',
		 	:picture => 'https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-ash3/t1.0-9/1484250_456797414452875_5063887629065003432_n.png',
		 	:description => "TEST DESCRIPTION",
		 	:link => "http://readersdoor.com"
		)
	end
end
