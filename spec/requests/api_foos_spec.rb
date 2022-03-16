require 'rails_helper'

RSpec.describe "Foo API", type: :request do
  include_context "db_cleanup_each", :transaction

  let(:valid_headers) {
     { headers: headers } 
  }
  let(:bad_id) {
      { id: 1234567890 }
  }
  let(:valid_attributes) {
    FactoryBot.attributes_for(:foo)
  }


  context "caller requests list of Foos" do
    let!(:foos) { FactoryBot.create_list(:foo, 5) }
  
    it "returns all instances" do
      get api_foos_path, params: { :sample1=>"param", :sample2=>"param" },
                        headers: {"Accept"=>"application/json"}
      expect(request.method).to eq("GET")
      assert_response :ok
      assert_equal "application/json", @response.media_type
      expect(response["X-Frame-Options"]).to eq("SAMEORIGIN")
  
      json = parsed_body
      expect(json.count).to eq(foos.count)
      expect(json.map{|f|f["name"]}).to eq(foos.map{|f|f[:name]})
    end
  end

  context "a specific Foo exists" do
    it "returns Foo when using correct ID" do
      foo = Foo.create! valid_attributes
      get api_foos_path(foo.id), as: :json
      expect(response).to be_successful
      # pp parsed_body
  
      json=parsed_body
      expect(json).to include(have_key("id")) # we have Array
      expect(json).to include(have_key("name")) # we have to OPEN array
      expect(json[0]["id"]).to eq(foo.id)
      expect(json[0]["name"]).to eq(foo.name)
  
      # ------------------ SECOND WAY FIX ------we JUST OPEN the array ------------
      # expect(json[0]).to have_key("id")            WAS => expect(payload).to have_key("id")
      # expect(json[0]).to have_key("name")
      # expect(json[0]["id"]).to eq(foo.id)          WAS => expect(payload["id"]).to eq(foo.id)
      # expect(json[0]["name"]).to eq(foo.name)
    end
    it "returns not found when using incorrect ID" do
      get api_foo_url(bad_id)
      # pp parsed_body
      assert_response :not_found
      assert_equal "application/json", @response.media_type
  
      json=parsed_body
      expect(json).to have_key("errors")
      expect(json["errors"]).to have_key("full_messages")
      expect(json["errors"]["full_messages"][0]).to include("cannot","#{bad_id.values}")
    end
  end
  context "existing Foo" do
    let(:new_name) { "testing" }
    let(:foo) {Foo.create! valid_attributes}

    it "can update name" do
      #verify name is not yet the new name
      expect(foo.name).to_not eq(new_name)
      
      # change to the new name
      put api_foo_url(foo.id), params: { foo: {:name=>new_name} }, headers: valid_headers, as: :json
      foo.reload
      expect(foo.name).to eq(new_name)
      assert_response :ok
      assert_equal "application/json", @response.media_type

      # verify we can locate the created instance in DB
      expect(Foo.find(foo.id).name).to eq(new_name)
    end
    it "can be deleted" do
      #  head вызов, это похоже на get, 
      # за исключением того, что ничего не возвращается, кроме заголовков
      head api_foo_path(foo.id)
      assert_response :ok
      assert_equal "application/json", @response.media_type

      delete api_foo_path(foo.id)
      expect(response).to have_http_status(:no_content)

      head api_foo_path(foo.id)
      expect(response).to have_http_status(:not_found)
    end
  end
end
