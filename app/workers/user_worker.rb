class UserWorker
	include Sidekiq::Worker
	sidekiq_options :queue => :default
	
	WorkUserWaitListDecrementInvitee = 'WorkUserWaitListDecrementInvitee'
	
	def perform work, params
		case work
		when WorkUserWaitListDecrementInvitee
			UserWorker.decrement_waiting_list params["id"]
		end
	end

	def self.decrement_waiting_list id
		decrement = RedisHelper::UserWaitList::UserWaitListDecrementOnSignIn.to_s
		clause = User.new(id).match + User::InvitedUser.match_first_login +
		" WITH user, friend, (CASE WHEN friend.wait_list_count= 0 THEN " + decrement + " ELSE friend.wait_list_count END) AS wait_list_count "\
		" SET friend.wait_list_count= COALESCE(wait_list_count - " + decrement + ", 0) "
		clause.execute
	end
end