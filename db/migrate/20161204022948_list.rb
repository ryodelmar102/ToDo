class List < ActiveRecord::Migration[5.0]
  def change
add_column :todo,:text,:string
add_column :todo,:done,:boolean
add_column :todo,:plan_date,:date
  end
end
