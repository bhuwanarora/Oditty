puts "Enter gender..."
["Male", "Female"].each do |name|
  Gender.find_or_create_by_name(name)
end
