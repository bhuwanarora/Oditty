module GenreList
  include MoreBooksForGenre
  include ELogger
  require 'nokogiri'
  require 'open-uri'

  def self.parse
    begin
      base_url = "https://www.goodreads.com"
      for i in 1..3 do
        url = base_url+"/genres/list?page=#{i}"
        doc = Nokogiri::HTML(open(url))
        doc.css(".actionLinkLite").each do |item|
          content = item.content
          if content
            href = base_url+item.attr("href")
            puts "#{content}"
            genre = GoodReadsGenre.find_or_create_by(:name => content)
            genre.update_column(:url, href)
          else
            puts "NOT FOUND"
          end
        end
      end
    rescue => e
      puts "Error #{e}"
    end
  end

  def self.get_books
    base_url = "https://www.goodreads.com/shelf/show/"
    GoodReadsGenre.where(:flag => nil).find_each do |genre|
      url = base_url+genre.name
      unless genre.flag
        begin
          doc = Nokogiri::HTML(open(url))
          page_number = doc.css('.mediumText .smallText')
          book_count = page_number[0].content.split("of")[1].gsub("\n","").gsub(")","").gsub(",","").to_i
          page_number = (book_count/50.0).ceil
          puts "#{genre.name} #{book_count} #{page_number}"
          genre.update_column(:book_count, book_count)
          if page_number >=1
            for i in 1..page_number do
              Resque.enqueue(GoodreadsBooksCrawlerWorker, i, genre.id, url)
              # parse_page(i, genre.id, url)
            end
          end
        rescue Exception => e
          debugger
          puts " DEBUG #{e} #{url} get_books"
          ELogger.log_info(" DEBUG #{e} #{url} get_books")
        end
      end
    end
  end

  def update_book_count
    base_url = "https://www.goodreads.com/shelf/show/"
    GoodReadsGenre.all.find_each do |genre|
      begin
        url = base_url+genre.name
        doc = Nokogiri::HTML(open(url))
        page_number = doc.css('.mediumText .smallText')
        book_count = page_number[0].content.split("of")[1].gsub("\n","").gsub(")","").gsub(",","").to_i
        puts "#{book_count}"
        genre.update_column(:book_count, book_count)
      rescue => e
        debugger
        puts e
      end
    end
  end

  def self.check_status
    str = ""
    GoodReadsGenre.where(:flag => true).find_each do |genre|
      book_count = genre.book_count 
      books = genre.good_reads_books.count
      if book_count == books
        puts "success for #{genre.name}"
      else
        str = str + "Error for genre #{genre.id} #{genre.name} #{book_count} #{books} \n"
      end
    end
    str
  end

  def get_books_for_genre id
    genre = GoodReadsGenre.find(id)
    base_url = "https://www.goodreads.com/shelf/show/"
    url = base_url+genre.name
    doc = Nokogiri::HTML(open(url))
    page_number = doc.css('.mediumText .smallText')
    book_count = page_number[0].content.split("of")[1].gsub("\n","").gsub(")","").gsub(",","").to_i
    page_number = (book_count/50.0).ceil
    if page_number >=1
      for i in 1..page_number do
        Resque.enqueue(GoodreadsBooksCrawlerWorker, i, genre.id, url)
        # parse_page(i, genre.id, url)
      end
    end
  end

  def self.parse_page(i, genre_id, url)
    begin
      genre = GoodReadsGenre.find genre_id
      url = url+"?page=#{i}"
      doc = Nokogiri::HTML(open(url))
      items = doc.css('.elementList .left')
      items.each do |item|
        item = item.css('.bookTitle')
        title = item[0].content 
        href = item.attr("href")
        puts "#{title}"
        book = GoodReadsBook.find_or_create_by(:title => title)
        GoodReadsBooksGenres.find_or_create_by(:good_reads_book_id => book.id, :good_reads_genre_id => genre.id)
        book_href = "https://www.goodreads.com"+href
        book.update_column(:url, book_href)
      end
      genre.update_column(:flag, true)
    rescue Exception => e
      puts "DEBUG #{e} #{url} #{i} #{genre_id}"
      debugger
      ELogger.log_info "DEBUG #{e} #{url} #{i} #{genre_id}"
    end
  end

  def self.get_book_details(id, book_href)
    doc = Nokogiri::HTML(open(book_href))
    book_rating = doc.css('.average')[0].content
    description = doc.css('#description span')[1].nil? ? doc.css('#description span')[0].content : doc.css('#description span')[1].content rescue nil
    authorName = doc.css('.authorName span')[0].content
    isbn = doc.css('.clearFloats:nth-child(2) .infoBoxRowItem')[0].content rescue ""
    isbns = []
    isbn = isbn.split("\n").map do |s|
      if s.strip != ""
        if s.strip.include?"ISBN13: "
          isbns.push s.strip.split("(ISBN13: ")[1].split(")")[0]
          s = isbns.join(",")
        else
          isbns.push s.strip
          s = nil
        end
      end
    end
    isbn.compact!
    book = GoodReadsBook.find id
    puts "update #{book.title} : #{book_rating} : #{authorName} : #{isbn[0]}"
    book.update_attributes(:rating => book_rating, 
                            :description => description, 
                            :authorName => authorName, 
                            :isbn => isbn[0],
                            :flag => true)
  end

  def self.update_flag
    GoodReadsGenre.where(:flag => true).map do |s|
      if s.good_reads_books.count == 0
        s.update_attributes(:flag => nil)
      end
    end
  end

  def self.test_count
    str = ""
    success_str = ""
    GoodReadsGenre.all.map do |s| 
      unless s.good_reads_books.count == s.book_count
        str = str + "#{s.name.upcase} : #{s.book_count - s.good_reads_books.count}" rescue str
      else
        success_str =  success_str + "SUCCESS: #{s.name.upcase}"
      end
    end
    puts str
    puts success_str
  end

end