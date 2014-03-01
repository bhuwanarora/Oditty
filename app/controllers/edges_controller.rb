class EdgesController < ApplicationController
	def new
		@edge = Edge.new
		render 'new'
	end
end
