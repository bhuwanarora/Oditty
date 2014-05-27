class ChatMessagesController < ApplicationController
	skip_before_filter :verify_authenticity_token  
	def index
		@message = ChatMessage.new
		@messages = ChatMessage.all
	end

	def create
    	@message = ChatMessage.create!(params[:chat_message])
    	respond_to do |format|
	    	format.js {render :action => 'create'}
    	end
  	end
end