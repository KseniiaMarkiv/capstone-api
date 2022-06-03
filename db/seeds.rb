# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
20.times do 
  City.create(
    name: Faker::Address.city
  )
end

20.times do 
  State.create(
    name: Faker::Address.state
  )
end

5.times do 
  Foo.create(
    name: Faker::Name.name
  )
end
