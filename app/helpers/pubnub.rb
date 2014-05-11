module Pubnub
	# require 'pubnub'

	def init
		@pubnub = Pubnub.new(
		    :publish_key   => 'demo',
		    :subscribe_key => 'demo',
		    :uuid => 'i_am_a_real_time_boss_1'
		)
	end

	def subscribe
		@pubnub.subscribe(:channel => 'demo') { |envelope|
	    	puts("\nchannel: #{envelope.channel}:\nmsg: #{envelope.message}")
	 	}
	end

	def publish
		@pubnub.publish(:channel  => 'demo', :message  => "Hello from the PubNub Ruby SDK!"){ |envelope|
		    puts("\nchannel: #{envelope.channel}\nmsg: #{envelope.message}")
		}
	end

end