FactoryBot.define do
  factory :image_content do
    content_type { "image/jpg" }
    sequence(:content) {|idx|
      File.open(ImageContentHelper.sample_filepath,"rb") { |f| 
        image=StringIO.new(f.read)
        image=ImageContentCreator.annotate(idx, image)
        Base64.encode64(image)
      }
      Base64.encode64(ImageContentHelper.sample_image_file.read) 
    }

    trait :wrong_types do
      content_type { "image/blah" }
      content { File.open("db/images/3.jpg", "rb") { |f| Base64.encode64(f.read)}}
    end

    trait :wrong_content do
      content_type { "image/jpg" }
      content { "blah blah blah" }
    end
  end
end
