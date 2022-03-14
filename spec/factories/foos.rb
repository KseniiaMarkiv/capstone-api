FactoryBot.define do
  factory :foo_faker, class: 'Foo' do
    name { Faker::Name.name }
  end
  factory :foo, :parent=>:foo_faker do
  end
end
