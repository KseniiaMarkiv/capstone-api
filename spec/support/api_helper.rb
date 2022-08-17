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

  def signup user, status = :ok
    post user_registration_path,
      params: { name: user[:name],
      email: user[:email],
      password: user[:password],
      password_confirmation: user[:password] },
    headers: user[:headers],
    as: :json
    expect(response).to have_http_status(status)
  
  end
  # def auth_tokens_for_user(user)
  #   # The argument 'user' should be a hash that includes the params 'email' and 'password'.
  #   post '/auth/sign_in/',
  #     params: { email: user[:email], password: user[:password] },
  #     as: :json
  #   # The three categories below are the ones you need as authentication headers.
  #   response.headers.slice('client', 'access-token', 'uid', 'token-type')
  # end

  def login user, status = :ok
    signup(FactoryBot.attributes_for(:user))
    assert_response :success
       
    user = FactoryBot.create(:user) # factory to create user
  pp request.headers.merge! user.create_new_auth_token 
    expect(response).to have_http_status(status)
    
  end
  def logout status=:not_found
    delete '/auth/sign_out'
    expect(response).to have_http_status(status) if status
  end
  # def get_auth_params_from_login_response_headers(response)
  #   client = response.headers['client']
  #   token = response.headers['access-token']
  #   expiry = response.headers['expiry']
  #   token_type = response.headers['token-type']
  #   uid = response.headers['uid']

  #   auth_params = {
  #     'access-token' => token,
  #     'client' => client,
  #     'uid' => uid,
  #     'expiry' => expiry,
  #     'token-type' => token_type
  #   }
  #   auth_params
  # end
  RSpec.shared_examples "resource index" do |model|
    let!(:resources) { FactoryBot.create_list( model, 5) }
    let!(:apply_roles) { apply_organizer User.find(user["id"]), resources }
    let(:json) { parsed_body }
  
    it "returns all #{model} instances" do
      get send("api_#{model}s_path"), params: { "#{model}": resources }, headers: headers, as: :json
      expect(response).to have_http_status(:ok)
      assert_equal "application/json", @response.media_type
  
      expect(json.count).to eq(resources.count)
      response_check if respond_to?(:response_check)
    end
  end

  RSpec.shared_examples "show resource" do |model|
    let(:resource) { FactoryBot.create(model) }
    let!(:apply_roles) { apply_organizer User.find(user["id"]), resources }
    let(:json) { parsed_body }
    let(:bad_id) { 1234567890 }
  
    it "returns #{model} when using correct ID" do
      get send("api_#{model}_path", resource.id)
      expect(response).to have_http_status(:ok)
      assert_equal "application/json", @response.media_type
      response_check if respond_to?(:response_check)
    end
  
    it "returns not found when using incorrect ID" do
      get send("api_#{model}_path", bad_id)
      expect(response).to have_http_status(:not_found)
      assert_equal "application/json", @response.media_type
  
      json=parsed_body
      expect(json).to have_key("errors")
      expect(json["errors"]).to have_key("full_messages")
      expect(json["errors"]["full_messages"][0]).to include("cannot","#{bad_id}")
    end
  end

  RSpec.shared_examples "create resource" do |model|
    let(:resource_state) { FactoryBot.create(model) }
    let(:json)        { parsed_body }
    let(:resource_id)    { json["id"] }

    it "can create valid #{model}" do
      post send("api_#{model}s_url"), params: { "#{model}": resource_state }, headers: headers, as: :json
      assert_response :created
      assert_equal "application/json", @response.media_type
  
      # verify payload has ID and delegate for addition checks
      expect(json).to have_key("id")
      response_check if respond_to?(:response_check)
      # pp json
      # verify we can locate the created instance in DB
      get send("api_#{model}_url", resource_id)
      expect(response).to have_http_status(:ok)
    end
  end

  RSpec.shared_examples "modifiable resource" do |model|
    let(:resource_state) {FactoryBot.create(:"#{model}")}
    let(:resource) do 
      post send("api_#{model}s_path"), params: { "#{model}": {:name=>resource_state[:name]}}, headers: headers, as: :json
      expect(response).to have_http_status(:created)
      parsed_body
    end
    
    let(:new_name) {FactoryBot.attributes_for(model)}
    it "can update #{model}" do
       #verify name is not yet the new name
      expect(resource["name"]).to_not eq(new_name)
      # pp new_name
      
      # change to new state
      put send("api_#{model}_path", resource["id"]), params: { "#{model}": new_name }, headers: headers, as: :json
      resource_state.reload
      expect(response).to have_http_status(:ok)

      update_check if respond_to?(:update_check)
    end
  
    it "can be deleted" do
      head send("api_#{model}_path", resource["id"])
      assert_response :ok
      assert_equal "application/json", @response.media_type
  
      delete send("api_#{model}_path", resource["id"])
      expect(response).to have_http_status(:no_content)
      
      head send("api_#{model}_path", resource["id"])
      expect(response).to have_http_status(:not_found)
    end
  end
  

end # Module