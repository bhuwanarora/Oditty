# Devise.setup do |config|                                                                                                                                                         
# 	require "omniauth-google-oauth2"
	
# 	if Rails.env.development?
# 		config.omniauth :facebook, "464752356963707", "ae55b5b58367c37b88dbcb95fb584e4c", :strategy_class => OmniAuth::Strategies::Facebook, :scope => 'email, offline_access, publish_stream, manage_pages, status_update, publish_actions, read_page_mailboxes'
# 	else
# 		config.omniauth :facebook, "189161627946475", "aa72dce120f443e35d31fae21a7c93a8", :strategy_class => OmniAuth::Strategies::Facebook, :scope => 'email, offline_access, publish_stream'
# 	end
# 	config.secret_key = '835ab3ca234bbea857b5267714d3261fe34491c65ad41c8e66c3d5b27dd5230ab2071b8d105b5f354b97d44fac34f8edf8b01a2d1837eb69174f288d385e8c8a'
# 	config.omniauth :google_oauth2, "88213598927-9fij1u8tf2ldf4apf6qob4hgu0supj54.apps.googleusercontent.com", "pP4kDX6BGOceD4JvBtPbOZiP", 
# 								{ access_type: "offline", approval_prompt: "" }
# 	require 'devise/orm/active_record'  
# end