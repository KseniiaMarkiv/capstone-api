require 'rails_helper'

RSpec.describe "/api/bars", type: :request do
  
  # This should return the minimal set of attributes required to create a valid
  # Api::Bar. As you add validations to Api::Bar, be sure to
  # adjust the attributes here as well.
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
      Api::Bar.create! valid_attributes
      get api_bars_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      bar = Api::Bar.create! valid_attributes
      get api_bar_url(bar)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_api_bar_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      bar = Api::Bar.create! valid_attributes
      get edit_api_bar_url(bar)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Api::Bar" do
        expect {
          post api_bars_url, params: { api_bar: valid_attributes }
        }.to change(Api::Bar, :count).by(1)
      end

      it "redirects to the created api_bar" do
        post api_bars_url, params: { api_bar: valid_attributes }
        expect(response).to redirect_to(api_bar_url(Api::Bar.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Api::Bar" do
        expect {
          post api_bars_url, params: { api_bar: invalid_attributes }
        }.to change(Api::Bar, :count).by(0)
      end

      it "renders a successful response (i.e. to display the 'new' template)" do
        post api_bars_url, params: { api_bar: invalid_attributes }
        expect(response).to be_successful
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested api_bar" do
        bar = Api::Bar.create! valid_attributes
        patch api_bar_url(bar), params: { api_bar: new_attributes }
        bar.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the api_bar" do
        bar = Api::Bar.create! valid_attributes
        patch api_bar_url(bar), params: { api_bar: new_attributes }
        bar.reload
        expect(response).to redirect_to(api_bar_url(bar))
      end
    end

    context "with invalid parameters" do
      it "renders a successful response (i.e. to display the 'edit' template)" do
        bar = Api::Bar.create! valid_attributes
        patch api_bar_url(bar), params: { api_bar: invalid_attributes }
        expect(response).to be_successful
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

    it "redirects to the api_bars list" do
      bar = Api::Bar.create! valid_attributes
      delete api_bar_url(bar)
      expect(response).to redirect_to(api_bars_url)
    end
  end
end
