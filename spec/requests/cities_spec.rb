require 'rails_helper'

RSpec.describe "/cities", type: :request do
  
  before(:each) { City.delete_all }
  after(:each) { City.delete_all }

  let(:valid_attributes) {
    # skip("Add a hash of attributes valid for your model")
    FactoryBot.attributes_for(:city)
  }

  let(:invalid_attributes) {
    # skip("Add a hash of attributes invalid for your model")
    { name: nil }
  }

  describe "GET /index" do
    it "renders a successful response" do
      City.create! valid_attributes
      get cities_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      city = City.create! valid_attributes
      get city_url(city)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_city_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      city = City.create! valid_attributes
      get edit_city_url(city)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new City" do
        expect {
          post cities_url, params: { city: valid_attributes }
        }.to change(City, :count).by(1)
      end

      it "redirects to the created city" do
        post cities_url, params: { city: valid_attributes }
        expect(response).to redirect_to(city_url(City.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new City" do
        expect {
          post cities_url, params: { city: invalid_attributes }
        }.to change(City, :count).by(0)
      end

      it "renders a successful response (i.e. to display the 'new' template)" do
        post cities_url, params: { city: invalid_attributes }
        # expect(response).to be_successful
        # expect(response).to have_http_status(:unprocessable_entity)
        assert_response :unprocessable_entity
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        # skip("Add a hash of attributes valid for your model")
        { name: "test_updated" }
      }

      it "updates the requested city" do
        city = City.create! valid_attributes
        patch city_url(city), params: { city: new_attributes }
        city.reload
        # skip("Add assertions for updated state")
        assert_equal "test_updated", city.name
      end

      it "redirects to the city" do
        city = City.create! valid_attributes
        patch city_url(city), params: { city: new_attributes }
        city.reload
        expect(response).to redirect_to(city_url(city))
      end
    end

    context "with invalid parameters" do
      it "renders a successful response (i.e. to display the 'edit' template)" do
        city = City.create! valid_attributes
        patch city_url(city), params: { city: invalid_attributes }
        assert_response :unprocessable_entity
        # expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested city" do
      city = City.create! valid_attributes
      expect {
        delete city_url(city)
      }.to change(City, :count).by(-1)
    end

    it "redirects to the cities list" do
      city = City.create! valid_attributes
      delete city_url(city)
      expect(response).to redirect_to(cities_url)
    end
  end
end
