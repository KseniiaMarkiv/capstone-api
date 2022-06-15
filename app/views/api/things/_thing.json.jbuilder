json.extract! thing, :id, :name, :description, :notes, :created_at, :updated_at
json.url api_thing_url(thing, format: :json)
