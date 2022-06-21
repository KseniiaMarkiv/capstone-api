require 'rails_helper'

RSpec.describe "/api/bars", type: :request do
  include_context "db_cleanup_each", :transaction  

  let(:valid_attributes) {
    FactoryBot.attributes_for(:api_bar)
  }

  let(:invalid_attributes) {
    { name: nil }
  }
  let(:valid_headers) {
     { headers: headers } 
  }

  describe "GET /index" do
    it "renders a successful response" do
      bar = Api::Bar.create! valid_attributes
      # pp bar
      get api_bars_url
      expect(request.method).to eq("GET")
      assert_response :success
      assert_equal "application/json", @response.media_type

      json=parsed_body
      expect(json[0]).to have_key("id")
      expect(json[0]).to have_key("name")
      expect(json[0]["name"]).to eq(bar.name)
      id=json[0]["id"]

      # verify we can locate the created instance in DB
      assert_equal Api::Bar.find(id).name, bar.name
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      bar = Api::Bar.create! valid_attributes
      get api_bar_url(bar)
      expect(response).to be_successful
    end
  end

  # describe "GET /new" do
  #   it "renders a successful response" do
  #     get new_api_bar_url
  #     expect(response).to be_successful
  #   end
  # end

  # describe "GET /edit" do
  #   it "renders a successful response" do
  #     bar = Api::Bar.create! valid_attributes
  #     get edit_api_bar_url(bar)
  #     expect(response).to be_successful
  #   end
  # end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Api::Bar" do
        expect {
          post api_bars_url, params: { api_bar: valid_attributes }
        }.to change(Api::Bar, :count).by(1)
        assert_equal "application/json", @response.media_type
      end

      it "renders a JSON response with the new api_bar" do
        post api_bars_url, params: { api_bar: valid_attributes }
        assert_response :created
        assert_equal "application/json", @response.media_type
      end
    end

    context "with invalid parameters" do
      it "does not create a new Api::Bar" do
        expect {
          post api_bars_url, params: { api_bar: invalid_attributes }
        }.to change(Api::Bar, :count).by(0)
      end

      it "renders a JSON response with errors for the new api_bar" do
        post api_bars_url, params: { api_bar: invalid_attributes }
        assert_response :unprocessable_entity
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        { name: "test_updated" }
      }

      it "updates the requested api_bar" do
        bar = Api::Bar.create! valid_attributes
        patch api_bar_url(bar), params: { api_bar: new_attributes }
        bar.reload
        assert_equal "test_updated", bar.name
      end

      it "renders a JSON response with the api_bar" do
        bar = Api::Bar.create! valid_attributes
        patch api_bar_url(bar), params: { api_bar: new_attributes }
        bar.reload
        assert_response :ok
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "renders a successful response (i.e. to display the 'edit' template)" do
        bar = Api::Bar.create! valid_attributes
        patch api_bar_url(bar), params: { api_bar: invalid_attributes }
        assert_response :unprocessable_entity
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested api_bar" do
      bar = Api::Bar.create! valid_attributes
      expect {
        delete api_bar_url(bar)
      }.to change(Api::Bar, :count).by(-1)
    end
  end
end