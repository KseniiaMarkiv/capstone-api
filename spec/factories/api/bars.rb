FactoryBot.define do
  factory :api_bar_faker, class: 'Api::Bar' do
    name { Faker::Name.name }
  end
  factory :api_bar, :parent=>:api_bar_faker do
  end
end