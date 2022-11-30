require 'rails_helper'

RSpec.describe "ApiBars", type: :request do
  include_context "db_cleanup_each", :transaction
  let(:originator) { apply_originator(signup(FactoryBot.attributes_for(:user)), Thing) }
  let(:user) { login originator }
 
  context "caller requests list of Bars" do
    it_should_behave_like "resource bar index", :api_bar do
      let(:response_check) do
        # pp json
        expect(json.count).to eq(resources.count);
        expect(json.map{|f|f["name"]}).to eq resources.map{|f|f[:name]}
      end
    end
  end
  context "a specific Bar exists" do
    it_should_behave_like "show bar resource", :api_bar do
      let(:response_check) do
        # pp json
        expect(json).to have_key("id")
        expect(json).to have_key("name")
        expect(json["id"]["$oid"]).to eq resource.id.to_s
        expect(json["name"]).to eq resource.name
      end
    end
  end

  context "create a new Bar" do
    it_should_behave_like "create bar resource", :api_bar do
      let(:response_check) {
        #pp json
        expect(json).to have_key("name")
        expect(json["name"]).to eq(resource_state[:name])

        # verify we can locate the created instance in DB
        expect(Api::Bar.find(resource_id).name).to eq resource_state[:name]
      }
    end
  end
  
  context "existing Bar" do
    it_should_behave_like "modifiable bar resource", :api_bar do
      let(:update_check) {
        #verify name is not yet the new name
        expect(resource["name"]).to_not eq new_name[:name]
        pp resource["name"]
        # verify DB has instance updated with name
        expect(Api::Bar.find(resource["id"]).name).to eq new_name[:name]
        pp Api::Bar.find(resource["id"]).name
      }
    end
  end
end # describe