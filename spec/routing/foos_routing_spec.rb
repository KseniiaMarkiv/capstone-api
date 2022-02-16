require "rails_helper"

RSpec.describe Api::FoosController, type: :routing do

  describe "routing" do
    it "routes to #index" do
      expect(get: "/api/foos").to route_to(format: :json, controller: "api/foos", action: "index")
    end

    it "routes to #show" do
      expect(get: "/api/foos/1").to route_to(format: :json, controller: "api/foos", action: "show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/api/foos").to route_to(format: :json, controller: "api/foos", action: "create")
    end

    it "routes to #update via PUT" do
      expect(put: "/api/foos/1").to route_to(format: :json, controller: "api/foos", action: "update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/api/foos/1").to route_to(format: :json, controller: "api/foos", action: "update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/api/foos/1").to route_to(format: :json, controller: "api/foos", action: "destroy", id: "1")
    end
  end
end
