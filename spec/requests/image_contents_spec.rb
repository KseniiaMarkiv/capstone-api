require 'rails_helper'

RSpec.describe "ImageContents", type: :request do
  include_context "db_cleanup"
 
  let!(:account) { FactoryBot.create(:user) }
  let(:image_props) { FactoryBot.attributes_for(:image) }
  let(:image_cont_props) { FactoryBot.attributes_for(:image_content) }
  let(:valid_headers) { { headers: headers } }
  let(:invalid_attributes) do
    {
      :content_type=>"",
      :content=>""
    }
  end
  let(:invalid_attr_cont) { FactoryBot.attributes_for(:image_content, :wrong_content) }
  let(:invalid_attr_type) { FactoryBot.attributes_for(:image_content, :wrong_types) }

  context "lifecycle" do
    include_context "db_clean_after"

    it "generates sizes from original" do
      # pp except_content image_props
      # pp except_content image_cont_props

      post images_url, params:
      {
        image: image_props, image_content: image_cont_props
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      # json = parsed_body
      # pp json
      expect(response).to have_http_status(:created)
      image=Image.find(parsed_body["id"])
      expect(ImageContent.image(image).count).to eq(5)
    end

    it "provides ImageContent upon request" do
      post images_url, params:
      {
        image: image_props, image_content: image_cont_props
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      expect(response).to have_http_status(:created)
      image=Image.find(parsed_body["id"])
      get image_content_path(image.id)   #no need for credentials
      expect(response).to have_http_status(:ok)
      pp response.header
      expect(response.header["content-transfer-encoding"]).to eq("binary")
      expect(response.header["content-type"]).to eq("image/jpg")
      expect(response.header["content-disposition"]).to include("inline")
      expect(response.header["content-disposition"]).to include("filename")

      expect(default=ImageContent.image(image).smallest.first).to_not be_nil
      expect(response.body.size).to eq(default.content.data.size)
    end

    it "deletes ImageContent with image" do
      post images_url, params:
      {
        image: image_props, image_content: image_cont_props
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      expect(response).to have_http_status(:created)
      id=parsed_body["id"]
      expect(Image.where(:id=>id)).to exist
      expect(ImageContent.where(:image_id=>id)).to exist

      delete image_url(id), params:
      {
        image: image_props, image_content: image_cont_props
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      expect(response).to have_http_status(:no_content)

      expect(Image.where(:id=>id)).to_not exist
      expect(ImageContent.where(:id=>id)).to_not exist

      get image_content_path(id)
      expect(response).to have_http_status(:not_found)
    end

    context "image responses" do
      before(:each) do
        @image=Image.all.first
        unless @image
          post images_url, params:
          {
            image: image_props, image_content: image_cont_props
          },
            headers: valid_headers.merge(account.create_new_auth_token), as: :json
          expect(response).to have_http_status(:created)
          @image=Image.find(parsed_body["id"])
        end
      end
      after(:each) do |test|
        if !test.exception
          expect(response).to have_http_status(:ok)
          ic=ImageContent.image(@image).smallest.first
          expect(response.body.size).to eq(ic.content.data.size)
        end
      end

      it "supplies content_url in show response" do
        get image_url(@image), as: :json
        expect(response).to have_http_status(:ok)
        json=parsed_body
        expect(json).to include("content_url")

        get json["content_url"]
      end

      it "supplies content_url in index response" do
        get images_url
        expect(response).to have_http_status(:ok)
        #pp parsed_body
        json=parsed_body
        expect(json.length).to be > 0
        expect(json[0]).to include("content_url")

        get json[0]["content_url"]
      end

      it "supplies content_url in thing image response" do
        thing=FactoryBot.create(:thing)
        thing.thing_images.create(:creator_id=>account["id"], :image=>@image) 

        get thing_thing_images_url(thing), as: :json
        expect(response).to have_http_status(:ok)
        json=parsed_body
        expect(json.length).to eq(1)
        expect(json[0]).to include("image_content_url")

        get json[0]["image_content_url"]
      end
    end
  end # end lifecycle

  shared_examples "image requires parameter" do |parameter|
    it "image requires content" do
      start_count=Image.count
      
      post images_url, params:
      {
        image: image_props, image_content: invalid_attributes
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      expect(response).to have_http_status(:bad_request)
      expect(Image.count).to eq(start_count) #image is not saved

      json=parsed_body
      # pp json
      expect(json).to include("errors")
      expect(json["errors"]).to include("full_messages")
      expect(json["errors"]["full_messages"][0]).to include("param is missing", parameter.to_s)
    end

  end

  context "validation" do
    include_context "db_clean_after"
    it_behaves_like "image requires parameter", :content 
    it_behaves_like "image requires parameter", :content_type 

    it "image requires valid content" do
      start_count=Image.count
      post images_url, params:
      {
        image: image_props, image_content: invalid_attr_cont
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      expect(response).to have_http_status(:unprocessable_entity)
      expect(Image.count).to eq(start_count) #image is not saved

      json=parsed_body
      pp json
      expect(json).to include("errors")
      expect(json["errors"]).to include("full_messages")
      expect(json["errors"]["full_messages"]).to include("unable to create image contents",
                                                            "no start of image marker found")
    end

    it "image requires supported content_type" do
      start_count=Image.count
      post images_url, params:
      {
        image: image_props, image_content: invalid_attr_type
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      # ap parsed_body
      expect(response).to have_http_status(:unprocessable_entity)
      expect(Image.count).to eq(start_count) #image is not saved

      json=parsed_body
      expect(json).to include("errors")
      expect(json["errors"]).to include("full_messages")
      expect(json["errors"]["full_messages"]).to include("unable to create image contents")

      expect(json["errors"]).to_not include("width")
      expect(json["errors"]).to_not include("height")
      expect(json["errors"]).to include("content_type")
      expect(json["errors"]["content_type"]).to include(/not supported type/)
    end

    it "rejects image too large" do
      content=""
      decoded_pad = Base64.decode64(image_cont_props[:content])
      begin
        content += decoded_pad
      end while content.size < ImageContent::MAX_CONTENT_SIZE
      image_cont_props[:content]=Base64.encode64(content)
      
      # ap "base64 size=#{content.size}"
      post images_url, params:
      {
        image: image_props, image_content: image_cont_props
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
      # ap parsed_body
      expect(response).to have_http_status(:unprocessable_entity)
      json=parsed_body
      expect(json["errors"]).to include("content")
      expect(json["errors"]["content"]).to include(/too large/)
    end
  end # end validation

  context "content queries" do
    include_context "db_clean_after"
    let(:image_content) { ImageContent.image(@image) }
    before(:each) do
      @image=Image.all.first
      unless @image   # make test is speeder
        post images_url, params:
        {
          image: image_props, image_content: image_cont_props
        },
          headers: valid_headers.merge(account.create_new_auth_token), as: :json
        expect(response).to have_http_status(:created)
        @image=Image.find(parsed_body["id"])
      end
    end

    it "provides size equal to width only" do
      ics=image_content.order(:width.asc)
      get image_content_url(@image, {width:ics[2].width})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[2].content.data.size)
    end

    it "provides smallest size GTE width only" do
      ics=image_content.order(:width.asc)
      get image_content_url(@image, {width:ics[2].width+1})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[3].content.data.size)
    end

    it "provides size equal to height only" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {height:ics[3].height})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[3].content.data.size)
    end

    it "provides smallest size GTE height only" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {height:ics[3].height+1})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[4].content.data.size)
    end

    it "provides size equal to width and height" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {width:ics[2].width, height:ics[3].height})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[3].content.data.size)
    end

    it "provides smallest size GTE width and height" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {width:ics[4].width, height:ics[2].height})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[4].content.data.size)
    end

    it "provides largest size " do
      ics=image_content.order(:height.desc)
      get image_content_url(@image)
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics.first.content.data.size)
    end
  end # end content queries

  context "content caching" do
    include_context "db_clean_after"
    let(:image_content) { ImageContent.image(@image) }
    let(:ic)    { image_content.order(:height.desc).first }
    before(:each) do
      @image=Image.all.first
      unless @image # make test is speeder
        post images_url, params:
      {
        image: image_props, image_content: image_cont_props
      },
        headers: valid_headers.merge(account.create_new_auth_token), as: :json
        expect(response).to have_http_status(:created)
        @image=Image.find(parsed_body["id"])
        # pp @image
      end
    end

    it "issues ETag based on content" do
      get image_content_url(@image)
      expect(response).to have_http_status(:ok)
      # rh = response.headers["ETag"]
      # pp Digest::MD5.hexdigest(rh)
      expect(response.header["ETag"]).to_not be_nil
      # expect(response.header["ETag"]).to eq(%("#{Digest::MD5.hexdigest(ic.cache_key)}"))
    end
    it "test rails ETag caching" do
      get image_content_url(@image)
      assert_response 200, @response.code
      etag = @response.headers["ETag"]
      get image_content_url(@image), headers: { "HTTP_IF_NONE_MATCH": etag }
      assert_response 304, @response.code
    end

    it "issues Cache-Control in distant future" do
      get image_content_url(@image)
      # pp response.headers
      expect(response).to have_http_status(:ok)
      expect(response.header["Cache-Control"]).to_not be_nil
      expect(response.header["Cache-Control"]).to include("max-age=#{1.year.to_int}, public")

      #now check the cached path
      etag = response.headers["ETag"]
      get image_content_url(@image), params: { image_content: nil }, headers: {"If-None-Match"=>etag}
      expect(response.header["Cache-Control"]).to include("max-age=#{1.year.to_int}, public")
    end

    it "issues content if-none-match" do
      get image_content_url(@image)
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ic.content.data.size)

      get image_content_url(@image), params: { image_content: nil }, headers: {"If-None-Match"=>"blah blah"}
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ic.content.data.size)
    end

    it "issues not-modified if if-match" do
      get image_content_url(@image)
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ic.content.data.size)
      etag = response.headers["ETag"]

      get image_content_url(@image), params: { image_content: nil }, headers: {"If-None-Match"=>etag}
      # pp response.status
      # pp response.headers
      expect(response).to have_http_status(:not_modified)
      expect(response.body.size).to eq(0)
    end

    it "keeps query parameters distinct" do
      get image_content_url(@image)
      # pp response.headers
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ic.content.data.size)
      etag = response.headers["ETag"]

      get image_content_url(@image, width: 100), params: { image_content: nil }, headers: {"If-None-Match"=>etag}
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(image_content.smallest(100).first.content.data.size)
      pp etag
      get image_content_url(@image), params: { image_content: nil }, headers: {"If-None-Match"=>etag}
      expect(response).to have_http_status(:not_modified)
      expect(response.body.size).to eq(0)

      get image_content_url(@image, width: 800), params: { image_content: nil }, headers: {"If-None-Match"=>etag}
      # pp response.headers
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(image_content.smallest(800).first.content.data.size)
    end

  end # end content caching
end
