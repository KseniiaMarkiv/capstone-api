require "rails_helper"

RSpec.describe StatesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "api/states").to route_to("states#index")
      assert_generates 'api/states', controller: 'states', action: 'index'

    end

    it "routes to #new" do
      expect(get: "api/states/new").to route_to("states#new")
    end

    it "routes to #show" do
      expect(get: "api/states/1").to route_to("states#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "api/states/1/edit").to route_to("states#edit", id: "1")
    end


    it "routes to #create" do
      expect(post: "api/states").to route_to("states#create")
      assert_recognizes({ controller: 'states', action: 'create' }, { path: 'api/states', method: :post })
      assert_routing({ path: 'api/states', method: :post }, { controller: 'states', action: 'create' })
    end

    it "routes to #update via PUT" do
      expect(put: "api/states/1").to route_to("states#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "api/states/1").to route_to("states#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "api/states/1").to route_to("states#destroy", id: "1")
    end
  end
end
