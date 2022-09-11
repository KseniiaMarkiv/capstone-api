class AddPointToImage < ActiveRecord::Migration[7.0]
  def change
    add_column :images, :lng, :float
    add_column :images, :lat, :float
    add_index :images, %i[lng lat]
  end
end
