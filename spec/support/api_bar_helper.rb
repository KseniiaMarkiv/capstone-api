require 'rails_helper'

module ApiBarHelper
  def parsed_body
    JSON.parse(response.body)
  end

  RSpec.shared_examples "resource bar index" do |model|
    let!(:resources) { FactoryBot.create_list( model, 5) }
    let(:json) { parsed_body }
  
    it "returns all #{model} instances" do
      get send("#{model}s_path"), params: {}, headers: {"Accept"=>"application/json"}
      expect(response).to have_http_status(:ok)
      assert_equal "application/json", @response.media_type
  
      expect(json.count).to eq(resources.count)
      response_check if respond_to?(:response_check)
    end
  end

  RSpec.shared_examples "show bar resource" do |model|
    let(:resource) { FactoryBot.create(model) }
    let(:json) { parsed_body }
    let(:bad_id) { 1234567890 }
  
    it "returns #{model} when using correct ID" do
      get send("#{model}_path", resource.id)
      expect(response).to have_http_status(:ok)
      assert_equal "application/json", @response.media_type
      response_check if respond_to?(:response_check)
    end
  
    it "returns not found when using incorrect ID" do
      get send("#{model}_path", bad_id)
      expect(response).to have_http_status(:not_found)
      assert_equal "application/json", @response.media_type
  
      json=parsed_body
      expect(json).to have_key("errors")
      expect(json["errors"]).to have_key("full_messages")
      expect(json["errors"]["full_messages"][0]).to include("cannot","#{bad_id}")
    end
  end

  RSpec.shared_examples "create bar resource" do |model|
    let(:resource_state) { FactoryBot.attributes_for(model) }
    let(:json)        { parsed_body }
    let(:resource_id)    { json["id"] }
    
    it "can create valid #{model}" do
      post send("#{model}s_path"), params: { "#{model}": resource_state }
      assert_response :created
      assert_equal "application/json", @response.media_type
  
      # verify payload has ID and delegate for addition checks
      expect(json).to have_key("id")
      response_check if respond_to?(:response_check)
      # pp json
      # verify we can locate the created instance in DB
      get send("#{model}_path", resource_id["$oid"])
      expect(response).to have_http_status(:ok)
    end
  end

  RSpec.shared_examples "modifiable bar resource" do |model|
    let(:resource_state) {FactoryBot.create(:"#{model}")}
    let(:resource) do 
      post send("#{model}s_path"), params: { "#{model}": {:name=>resource_state[:name]}}
      expect(response).to have_http_status(:created)
      parsed_body
    end
    
    let(:new_name) {FactoryBot.attributes_for(model)}
    it "can update #{model}" do
       #verify name is not yet the new name
      expect(resource["name"]).to_not eq(new_name)
      # pp new_name
      
      # change to new state
      put send("#{model}_path", resource["id"]["$oid"]), params: { "#{model}": new_name }
      resource_state.reload
      expect(response).to have_http_status(:ok)

      update_check if respond_to?(:update_check)
    end
  
    it "can be deleted" do
      head send("#{model}_path", resource["id"]["$oid"])
      assert_response :ok
      assert_equal "application/json", @response.media_type
  
      delete send("#{model}_path", resource["id"]["$oid"])
      expect(response).to have_http_status(:no_content)
      
      head send("#{model}_path", resource["id"]["$oid"])
      expect(response).to have_http_status(:not_found)
    end
  end
  

end # Module