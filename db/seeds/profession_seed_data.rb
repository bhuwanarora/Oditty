puts "Enter professions..."
professions = ["Author", "Student", "Teacher", "Librarian"]
professions.each do |name|
	Profession.find_or_create_by_name(name)
end
