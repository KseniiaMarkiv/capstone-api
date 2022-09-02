FactoryBot.define do
  factory :image_content do
    content_type { "image/jpg" }
    content { File.open("db/images/3.jpg", "rb") { |f| Base64.encode64(f.read)
      }}

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
