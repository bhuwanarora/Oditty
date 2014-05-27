module MoreBooksForGenre
  require 'nokogiri'
  require 'open-uri'
  BookNames = []

  def self.parse url
    puts "#{url}"
    doc = Nokogiri::HTML(open(url))
    items = doc.css('.bigBox~ .bigBox+ .bigBox .moreLink .actionLink')
    if items.present?
      items.each do |item|
        debugger
        puts item
      end
    else
      puts "MORE BOOKS LINK NOT FOUND FOR #{url}"
    end
  end
end
