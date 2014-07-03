class XmppController < ApplicationController
	
	def xmpp
		msg = Blather::Stanza::Message.new
		msg.to = 'xmpp_user2@localhost'
		msg.body = "Message Body".to_json

		Courses::Application.config.client.write_to_stream msg
	end
end