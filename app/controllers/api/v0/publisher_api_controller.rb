module Api
	module V0
		class PublisherApiController < ApplicationController

			def get_info
				id = params[:id]
				key = "GI" + id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::PublisherApi.get_info(id)
					$redis.set(key, info.to_json)
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end

			def get_books
				id = params[:id]
				key = "GB" + id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::PublisherApi.get_books(id)
					$redis.set(key, info.to_json)
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end
		end
	end
end