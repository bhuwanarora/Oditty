class Publisher < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" publisher.name as name, ID(publisher) as id, publisher.image_url as image_url, publisher."
	end

	def get_info
	end

	def match
		" MATCH (publisher:Publisher) WHERE "
	end

	def self.set_seed_info		
		query = "CREATE(a:Publisher { "
		query += "name: 'hachette india', " 
		query += "url: 'http://www.hachetteindia.com/', "
		query += "logo: 'http://www.hachetteindia.com/images/logo.gif', "
		query += "description: 'Hachette India is the Indian arm of Hachette UK, which is made up of companies like Headline, Hodder & Stoughton, Little, Brown, Octopus, Orion, Chambers-Harrap, Piatkus, John Murray Press and Hachette Children’s Books; with legendary imprints like John Murray, Everyman, Gollancz, Orbit, Abacus, Sceptre, Virago, Business Plus, Weidenfeld & Nicolson, Cassell, Hamlyn, Bounty, etc.; and brands like John Grisham, Asterix, Enid Blyton, Horrid Henry, Stephen King, Steve Berry, Jeffery Deaver, Jodi Picoult, Alexander McCall Smith, Gregory David Roberts, Mathew Reilly, Martina Cole, James Patterson, Robert Ludlum, Vikram Seth and Amitav Ghosh (in the UK), Ruth Prawer Jhabvala and Lavanya Sankaran, to name a few. Hachette India commenced operations in 2008 and began its local publishing programme in May 2009 with Amit Varma’s My Friend Sancho, the highest selling fiction debut of the year. This was followed by such books as Manjit Kumar’s Quantum (shortlisted for the BBC Samuel Johnson Prize for Non-Fiction 2009) and Seeds of Terror by Gretchen Peters. The Children’s books division got off to a great start as well with the bestselling The Mahatma and the Monkeys. The year that followed saw the publication of several bestselling titles including Turbulence by Samit Basu, Third Best by Arjun Rao and a spate of non-fiction leads like 24 Akbar Road, The Absent State, The Red Market, Travelling Diva and Diva Green by celebrity Chef Ritu Dalmia, Durbar by Tavleen Singh, The Billionaire’s Apprentice by Anita Raghavan and the country’s first Yearbook and Infopedia for Children. Hachette India publishes general, literary and commercial fiction, children’s and reference books as well as non- fiction, covering memoirs, self help, travel, history, business, popular culture, lifestyle and sport. Hachette UK is a part of Hachette Livre France, the dominant market leading publisher in France. The Hachette group is itself owned by the Lagardere group which has as parallel subsidiary groups the world’s number 1 magazine publisher in Hachette Filippachi, (Paris Match, Elle magazine, etc.), sports management companies, distribution and retail businesses (Relay and Newslink brands in Europe and Asia Pacific).'"
		query += "})"
		query.execute
	end
	
end