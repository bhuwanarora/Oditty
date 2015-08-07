require 'resque/server'

class SecureResqueServer < Resque::Server

  	use Rack::Auth::Basic, "Restricted Area" do |username, password|
		[username, password] == ['queres', 'resque_password_1234']
  	end

end