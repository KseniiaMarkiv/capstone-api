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

  describe "GET /index" do
    it "renders a successful response" do
      Foo.create! valid_attributes
      get api_foos_url, headers: valid_headers, as: :json
      expect(request.method).to eq("GET")
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      foo = Foo.create! valid_attributes
      get api_foo_url(foo), as: :json
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Foo" do
        expect {
          post api_foos_url,
               params: { foo: valid_attributes }, headers: valid_headers, as: :json
        }.to change(Foo, :count).by(1)
      end

      it "renders a JSON response with the new foo" do
        post api_foos_url,
             params: { foo: valid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))
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
        expect(response).to have_http_status(:unprocessable_entity)
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
        # skip("Add assertions for updated state")
        assert_equal "test_updated", foo.name
        # expect(foo.name).to eq(valid_attributes.name)
        # expect(foo['name']).to eq(valid_attributes['name'])

      #   NoMethodError:
      #  undefined method `name' for {:name=>"Lorene Considine"}:Hash
      end

      it "renders a JSON response with the foo" do
        foo = Foo.create! valid_attributes
        patch api_foo_url(foo),
              params: { foo: new_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the foo" do
        foo = Foo.create! valid_attributes
        patch api_foo_url(foo),
              params: { foo: invalid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
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
