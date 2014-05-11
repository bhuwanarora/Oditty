class CreateHumanProfileAddresses < ActiveRecord::Migration
  def change
    create_table :human_profile_addresses do |t|

      t.timestamps
    end
  end
end
