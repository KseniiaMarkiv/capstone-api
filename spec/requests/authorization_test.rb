# it's example from spec\support\api_helper.rb with   # def auth_tokens_for_user(user) method

require 'rails_helper'
require "awesome_print"
RSpec.describe 'Authentication Api', type: :request do


  include ActionController::RespondWith

  include_context "db_cleanup_each", :transaction
  let(:user_props) { FactoryBot.attributes_for(:user) }

  let(:valid_headers) {
     { headers: headers } 
  }

  let(:account) { signup FactoryBot.attributes_for(:user) }
  let(:valid_attributes) { FactoryBot.attributes_for(:image) }
  let(:invalid_attributes) { {creator_id: '', caption: ''} }

  xcontext 'sign-up' do
    context 'valid registration' do

      it 'successfully creates account' do
        signup user_props

        assert_response :success

        user_props
        assert_response :success

        json=parsed_body
        expect(json).to include("status"=>"success")
        expect(json).to include("data")
        expect(json["data"]).to include("id")
        expect(json["data"]).to include("provider"=>"email")
        expect(json["data"]).to include("uid"=>user_props[:email])
        expect(json["data"]).to include("name"=>user_props[:name])
        expect(json["data"]).to include("email"=>user_props[:email])
        expect(json["data"]).to include("created_at","updated_at")
      end
    context 'invalid registration' do
      context 'missing information' do
        it 'reports error with messages' do
          signup user_props.except(:email), :unprocessable_entity
        # pp parsed_body

        json=parsed_body
        expect(json).to include("status"=>"error")
        expect(json).to include("data")
        expect(json["data"]).to include("email"=>nil)
        expect(json).to include("errors")
        expect(json["errors"]).to include("email")
        expect(json["errors"]).to include("full_messages")
        expect(json["errors"]["full_messages"]).to include(/Email/i)

        end
      end
    end
    context 'non-unique information' do
      it 'reports non-unique e-mail' do
      signup user_props, :ok
      # pp parsed_body
      signup user_props, :unprocessable_entity
      # pp parsed_body
        
        json=parsed_body
        expect(json).to include("status"=>"error")
        expect(json).to include("errors")
        expect(json["errors"]).to include("email")
        expect(json["errors"]).to include("full_messages")
        expect(json["errors"]["full_messages"]).to include(/Email/i)
      end
    end
    end
  end # sign-up

  xcontext 'anonymous user' do
    it 'accesses unprotected' do
      get '/authn/whoami'
      # pp parsed_body
      expect(response).to have_http_status(:success)
      expect(parsed_body).to eq({})
    end
    it 'fails to access protected resource' do
      get '/authn/checkme'
      # pp parsed_body
      expect(response).to have_http_status(:unauthorized)
      expect(parsed_body).to include("errors"=>["You need to sign in or sign up before continuing."])
    end
  end # anonymous user
  xcontext 'login' do
    
    context 'valid user login' do
        
      it 'generates access token' do
        signup user_props
        @auth_tokens = auth_tokens_for_user(user_props)
        pp response.headers
        expect(response.headers).to include("uid")
        expect(response.headers).to include("access-token")
        expect(response.headers).to include("client")
        expect(response.headers["token-type"]).to include("Bearer")
      end
    
      it 'extracts access headers' do
        signup user_props
        @auth_tokens = auth_tokens_for_user(user_props)
        if expect(response.headers).to include("access-token")
          puts "Headers already exist"
          response.headers["uid"]
          response.headers["client"]
          response.headers["token-type"]
          response.headers["access-token"]
        end
      end

      it 'grants access to resource' do
        get '/authn/checkme', headers: valid_headers, as: :json
        expect(response).to have_http_status(:unauthorized)
        signup user_props
        @auth_tokens = auth_tokens_for_user(user_props)
              
        #pp parsed_body
        expect(response).to have_http_status(:success)

        json=parsed_body
        # pp json["data"]
        expect(json["data"]).to include("id")
        expect(json["data"]).to include("uid")
      end
      xit "grants access to resource multiple times" do
        (1..10).each do |idx|
          # puts idx
          # sleep 6
          #quick calls < 5sec use same tokens
          get authn_checkme_path,  headers: valid_headers, as: :json
          expect(response).to have_http_status(:unauthorized)
        
          signup user_props, :ok
          @auth_tokens = auth_tokens_for_user(user_props)
          expect(response).to have_http_status(:ok)

          get authn_checkme_path, headers: @auth_tokens, as: :json
          assert_response :success
        end
      end

      it 'logout' do
        logout :ok
        # pp response
        
        get authn_checkme_path
        expect(response).to have_http_status(:unauthorized)
      end
      context 'invalid password' do
        it 'rejects credentials' do
          post '/auth/',
          params: {:password=>'password', :password_confirmation=>'password_confirmation'}, as: :json
          ap parsed_body['errors']['full_messages']
          expect(response).to have_http_status(:unprocessable_entity) 
        end
      end
    end

  end # login

  xcontext "quick API check" do
    before(:each) do
      signup user_props
      @auth_tokens = auth_tokens_for_user(user_props)
    end
    it_should_behave_like "resource index", :image
    it_should_behave_like "show resource", :image
    it '' do
      post '/api/images/',
        params: {
          image: valid_attributes
        },
      headers: @auth_tokens

      assert_response :created
    end
  end
end