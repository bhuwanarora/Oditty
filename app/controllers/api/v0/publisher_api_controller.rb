module Api
	module V0
		class PublisherApiController < ApplicationController

			def get_info
				id = params[:id]
				info = RedisHelper.get_publisher_info({:id => id})
				unless info
					info = Api::V0::PublisherApi.get_info(id)
					RedisHelper.set_publisher_info({:id => id, :info => info})
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end

			def get_books
				id = params[:id]
				info = RedisHelper.get_publisher_books({:id => id})
				unless info
					info = Api::V0::PublisherApi.get_books(id)
					RedisHelper.set_publisher_books({:id => id, :info => info})
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end
		end
	end
end