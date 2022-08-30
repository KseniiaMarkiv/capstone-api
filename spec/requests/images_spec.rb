require 'rails_helper'
require "awesome_print"


RSpec.describe "/images", type: :request do
  include ActionController::RespondWith
  include_context "db_cleanup_each", :transaction
  let(:account) { signup FactoryBot.attributes_for(:user) }
  # let(:account) { FactoryBot.attributes_for(:user) }
  let(:valid_attributes) { FactoryBot.attributes_for(:image) }
  let(:invalid_attributes) { {creator_id: '', caption: ''} }
  let(:valid_headers) {
    { headers: headers } 
 }
 
  context "quick API check" do
    it_should_behave_like "resource index", :image
    it_should_behave_like "show resource", :image 
  end
  context "quick API check with auth" do
    let!(:user) { login account }
    it_should_behave_like "create resource", :image
    it_should_behave_like "modifiable resource", :image 
  end
  
  shared_examples "cannot create" do 
    it "create fails" do
      post images_path, params: { image: valid_attributes }
      expect(response.status).to be >= 400
      expect(response.status).to be < 500
      expect(parsed_body).to include("errors")
    end
  end
  shared_examples "can create" do
    it "is created" do
      post images_path, params: { image: valid_attributes }
      pp parsed_body
      expect(response).to have_http_status(:found)
      payload=parsed_body
      expect(payload).to include("id")
      # expect(payload).to include("caption"=>image_props[:caption])
    end
  end
  shared_examples "all fields present" do 
    it "list has all fields" do
      get images_path
      expect(response).to have_http_status(:ok)
      #pp parsed_body
      payload=parsed_body
      expect(payload.size).to_not eq(0)
      payload.each do |r|
        expect(r).to include("id")
        expect(r).to include("caption")
      end
    end
    it "get has all fields" do
      get image_path(image_id)
      expect(response).to have_http_status(:ok)
      #pp parsed_body
      payload=parsed_body
      expect(payload).to include("id"=>image.id)
      expect(payload).to include("caption"=>image.caption)
    end
  end

  describe "access" do
    let(:images_props) { FactoryBot.attributes_for(:image, :with_caption) }
    let(:image_props) { images_props[0] }
    let!(:images)  { Image.create(FactoryBot.attributes_for(:image, :with_caption)) }
    let(:image)     { images[0] }

    context "caller is unauthenticated" do
      before(:each) { login nil }
      it_should_behave_like "cannot create"
      it_should_behave_like "all fields present"
      
    end
    context "caller is authenticated organizer" do
      let!(:user)   { login account }
      it_should_behave_like "can create"
      it_should_behave_like "all fields present"
    end
  end

end