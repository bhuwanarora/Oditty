class AddUrlToTags < ActiveRecord::Migration
  def change
  	add_column :tags, :url, :text
  end
end
