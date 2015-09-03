namespace :daily_tasks do
	desc "User Wait list decrement and Wait list buffer reset"
	task :user_wait_list => :environment do
		UserHelper.wait_list_decrement
		RedisHelper::UserWaitList.reset
	end
end