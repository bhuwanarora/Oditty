ReadersDoorUsers = [{:name => "Bhuwan Arora", :email => "bhuwanarora67@gmail.com"},
					{:name => "Manik Sharma", :email => "manik.sharma90@gmail.com"}]

ReadersDoorUsers.each do |user|
	human_profile = HumanProfile.find_or_create_by_name(user[:name])
	if human_profile.new_record?
		User.create(:email => user[:email], :human_profile_id => human_profile.id)
	end
end

ReadersDoorAdmin.find_or_create_by(:name => "Bhuwan", :email => "bhuwanarora67@gmail.com")
ReadersDoorAdmin.find_or_create_by(:name => "Manik", :email => "manik.sharma90@gmail.com")