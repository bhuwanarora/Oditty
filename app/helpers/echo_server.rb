require 'eventmachine'

 module EchoServer
   def post_init
     puts "-- someone connected to the echo server!"
   end

   def receive_data data
     send_data ">>>test: #{data}"
     close_connection if data =~ /quit/i
   end

   def unbind
     puts "-- someone disconnected from the echo server!"
   end
end

puts "module eventmachine..."
# Note that this will block current thread.
# EventMachine.run {
#   EventMachine.start_server "127.0.0.1", 8081, EchoServer
#   puts "Listening..."
#   # EM::Timer.new(10) do
#   #   puts 'Timed-out after 10 seconds'
#   #   EM.stop_event_loop
#   # end
# }

puts "end..."