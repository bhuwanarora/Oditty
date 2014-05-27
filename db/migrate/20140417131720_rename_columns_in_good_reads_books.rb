class RenameColumnsInGoodReadsBooks < ActiveRecord::Migration
  def change
  	rename_column :good_reads_books, :authorName, :author_name
  	rename_column :good_reads_books, :authorUrl, :author_url
  end
end
