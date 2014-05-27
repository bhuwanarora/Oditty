class CreateAuthorCrawlStatuses < ActiveRecord::Migration
  def change
    create_table :author_crawl_statuses do |t|
    	t.string :page_number
    	t.string :status

      t.timestamps
    end
  end
end
