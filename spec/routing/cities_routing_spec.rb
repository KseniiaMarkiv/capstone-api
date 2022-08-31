require "rails_helper"

RSpec.describe CitiesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "api/cities").to route_to("cities#index")
    end

    it "routes to #new" do
      expect(get: "api/cities/new").to route_to("cities#new")
    end

    it "routes to #show" do
      expect(get: "api/cities/1").to route_to("cities#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "api/cities/1/edit").to route_to("cities#edit", id: "1")
    end


    it "routes to #create" do
      expect(post: "api/cities").to route_to("cities#create")
    end

    it "routes to #update via PUT" do
      expect(put: "api/cities/1").to route_to("cities#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "api/cities/1").to route_to("cities#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "api/cities/1").to route_to("cities#destroy", id: "1")
    end
  end
end
