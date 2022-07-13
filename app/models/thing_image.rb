class ThingImage < ApplicationRecord
  belongs_to :image
  belongs_to :thing

  validates :image, :thing, presence: true

  scope :prioritized,-> { order(:priority=>:asc) }
  scope :things,     -> { where(:priority=>0) }
  scope :primary,    -> { where(:priority=>0).first }

  scope :with_name,    ->{ with_thing.select("things.name as thing_name")}
  scope :with_caption, ->{ with_image.select("images.caption as image_caption")}
end
