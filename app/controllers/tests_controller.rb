class TestsController < ApplicationController
	include FreebaseTester

	def freebase_search
		search_params = params[:q]
		r = FreebaseTester.search_resource search_params
		render :json => {:data => r}, :status => 200
	end

	def freebase
	end

	def freebase_resource
		search_params = params[:q]	
		r = FreebaseTester.fetch_resource search_params
		mql = FreebaseTester.mqlread search_params
		render :json => {:name => r.name, 
						:description => r.description, 
						:image => "data:image/gif;base64,"+Base64.encode64(r.image.retrieve), 
						:properties => r.properties,
						:mql => mql}, :status => 200
	end

	def horizontal_scroll
		
	end

	def angular_test
		
	end

end