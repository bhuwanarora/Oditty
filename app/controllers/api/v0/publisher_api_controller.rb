module Api
	module V0
		class PublisherApiController < ApplicationController

			def get_info
				id = params[:id]
				info = RedisHelper::Publisher.get_info({:id => id})
				unless !info.nil?
					info = Api::V0::PublisherApi.get_info(id)
					RedisHelper::Publisher.set_info({:id => id, :info => info})
				end
				render :json => info, :status => 200
			end

			def get_books
				id = params[:id]
				info = RedisHelper::Publisher.get_books({:id => id})
				unless !info.nil?
					info = Api::V0::PublisherApi.get_books(id)
					RedisHelper::Publisher.set_books({:id => id, :info => info})
				end
				render :json => info, :status => 200
			end
		end
	end
end