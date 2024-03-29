FactoryBot.define do
  
  factory :point do
    transient do
      lng { Faker::Number.negative(from: -77.0, to: -76.0).round(6) }
      lat { Faker::Number.positive(from: 38.7, to: 39.7).round(6) }
    end
    initialize_with { Point.new(lng, lat) }

    trait :jhu do
      lng { -76.6200464 }
      lat { 39.3304957 }
    end
  end

  factory :postal_address do
    transient do
      sequence(:street_address) {|idx| "#{3000+idx} North Charles Street"}
      city           { "Baltimore" }
      state_code     { "MD" }
      zip            { "21218" }
      country_code   { "US" }
    end
    initialize_with { PostalAddress.new(street_address,city,state_code,zip,country_code) }

    trait :jhu do
      street_address { "3400 North Charles Street" }
      city           { "Baltimore" }
      state_code     { "MD" }
      zip            { "21218" }
      country_code   { "US" }
    end
  end

  factory :location do
    address           { FactoryBot.build(:postal_address) }
    position          { FactoryBot.build(:point) }
    formatted_address {
      street_no=address.street_address.match(/^(\d+)/)[1]
      "#{street_no} N Charles St, Baltimore, MD 21218, USA" 
    }
    initialize_with { Location.new(formatted_address,position,address) }

    trait :jhu do
      address { FactoryBot.build(:postal_address, :jhu) }
      position { FactoryBot.build(:point, :jhu) }
    end
  end

end
