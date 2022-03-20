require 'rails_helper'

RSpec.describe "/api/foos", type: :request do
  include_context "db_cleanup_each", :transaction

  let(:valid_attributes) {
    # skip("Add a hash of attributes valid for your model")
    FactoryBot.attributes_for(:foo)
  }

  let(:invalid_attributes) {
    # skip("Add a hash of attributes invalid for your model")
    { name: nil }
  }
  let(:valid_headers) {
     { headers: headers } 
  }
  let(:bad_id) {
    { id: 1234567890 }
  }

  describe "GET /index" do
    it "renders a successful response" do
      foo = Foo.create! valid_attributes
      get api_foos_url, headers: valid_headers, as: :json
      expect(request.method).to eq("GET")
      assert_response :success
      assert_equal "application/json", @response.media_type
      
      json=parsed_body
      expect(json[0]).to have_key("id")
      expect(json[0]).to have_key("name")
      assert_equal json[0]["name"], foo.name
      id=json[0]["id"]

      # verify we can locate the created instance in DB
      assert_equal Foo.find(id).name, foo.name
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      foo = Foo.create! valid_attributes
      get api_foo_url(foo), as: :json
      assert_response :success
      assert_equal "application/json", @response.media_type

      json=parsed_body
      expect(json).to have_key("id")  # we have Hash
      expect(json).to have_key("name")
      # expect(json["name"]).to eq(foo[:name])
      assert_equal json["name"], foo.name
      id=json["id"]

      # verify we can locate the created instance in DB
      expect(Foo.find(id).name).to eq(foo[:name])
      # assert_equal Foo.find(id).name, foo.name
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Foo" do
        expect {
          post api_foos_url,
               params: { foo: valid_attributes }, headers: valid_headers, as: :json
        }.to change(Foo, :count).by(1)
        assert_equal "application/json", @response.media_type
      end

      it "renders a JSON response with the new foo" do
        post api_foos_url,
             params: { foo: valid_attributes }, headers: valid_headers, as: :json
        assert_response :created
        # expect(response.content_type).to match(a_string_including("application/json"))
        assert_equal "application/json", @response.media_type
      end
      it "check the payload of the response" do
        foo = Foo.create! valid_attributes
        get api_foo_url(foo), as: :json
        assert_response :success
        assert_equal "application/json", @response.media_type

        json=parsed_body
        expect(json).to have_key("id")
        expect(json).to have_key("name")
        expect(json["name"]).to eq(foo[:name])
        id=json["id"]
  
        # verify we can locate the created instance in DB
        expect(Foo.find(id).name).to eq(foo[:name])
      end
    end

    context "with invalid parameters" do
      it "does not create a new Foo" do
        expect {
          post api_foos_url,
               params: { foo: invalid_attributes }, as: :json
        }.to change(Foo, :count).by(0)
      end

      it "renders a JSON response with errors for the new foo" do
        post api_foos_url,
             params: { foo: invalid_attributes }, headers: valid_headers, as: :json
        assert_response :unprocessable_entity
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        # skip("Add a hash of attributes valid for your model")
        { name: "test_updated" }
      }

      it "updates the requested foo" do
        foo = Foo.create! valid_attributes
        patch api_foo_url(foo),
              params: { foo: new_attributes }, headers: valid_headers, as: :json
        foo.reload
        assert_equal "test_updated", foo.name
        # expect(foo["name"]).to eq("test_updated")
      end

      it "renders a JSON response with the foo" do
        foo = Foo.create! valid_attributes
        patch api_foo_url(foo),
              params: { foo: new_attributes }, headers: valid_headers, as: :json
        assert_response :ok
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the foo" do
        foo = Foo.create! valid_attributes
        patch api_foo_url(foo),
              params: { foo: invalid_attributes }, headers: valid_headers, as: :json
        assert_response :unprocessable_entity
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested foo" do
      foo = Foo.create! valid_attributes
      expect {
        delete api_foo_url(foo), headers: valid_headers, as: :json
      }.to change(Foo, :count).by(-1)
    end
    
  end

end




