require 'rails_helper'

module ApiHelper
  def parsed_body
    JSON.parse(response.body)
  end

   # automates the passing of payload bodies as json
  # ["post", "put", "patch", "get", "head", "delete"].each do |http_method_name|
  #   define_method("j#{http_method_name}") do |path,params={},headers={}| 
  #     if ["post","put","patch"].include? http_method_name
  #       headers=headers.merge('content-type' => 'application/json') if !params.empty?
  #       params = params.to_json
  #     end
  #   end
  # end

  def signup(registration, status = :ok)
    post user_registration_path, params: { user: registration }, as: :json
    expect(response).to have_http_status(status)
    json=parsed_body
    if response.ok?
      registration.merge(id: json['data']['id'],
                         uid: json['data']['uid'])
    end
  end
  
  def login credentials, status=:ok
    post user_session_path, credentials.slice(:email, :password)
    expect(response).to have_http_status(status)
    return response.ok? ? parsed_body["data"] : parsed_body
  end
  def logout status=:ok
    delete destroy_user_session_path
    @last_tokens={}
    expect(response).to have_http_status(status) if status
  end

  def access_tokens?
    !response.headers["access-token"].nil? if response
  end
  
  def access_tokens
    if access_tokens?
      @last_tokens=["uid","client","token-type","access-token"].inject({}) {|h,k| h[k]=response.headers[k]; h}
    end
    @last_tokens || {}
  end

  RSpec.shared_examples "resource index" do |model|
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

  RSpec.shared_examples "show resource" do |model|
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

  RSpec.shared_examples "create resource" do |model|
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

  RSpec.shared_examples "modifiable resource" do |model|
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