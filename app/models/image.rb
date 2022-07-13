class Image < ApplicationRecord
  validates :creator_id, presence: true

  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images
end
