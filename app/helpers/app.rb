require 'blather/client/dsl'

module App
  extend Blather::DSL

  def self.run
    EM.run { client.run }
  end

  setup 'echo@jabber.local', 'echo'

  # Auto approve subscription requests
  subscription :request? do |s|
    write_to_stream s.approve!
  end

  # Echo back what was said
  message :chat?, :body do |m|
    write_to_stream m.reply
  end
end

trap(:INT) { EM.stop }
trap(:TERM) { EM.stop }

Thread.new { App.run }