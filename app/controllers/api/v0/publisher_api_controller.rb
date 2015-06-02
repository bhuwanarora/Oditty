module Api
	module V0
		class PublisherApiController < ApplicationController

			def get_info
				begin
					id = params[:id]
					info = Publisher.get_info(id).execute
					status = 200	
				rescue Exception => e
					status = 
					puts e.to_s.red
					info = nil
				end
				render :json => info, :status => 200
			end
		end
	end
end