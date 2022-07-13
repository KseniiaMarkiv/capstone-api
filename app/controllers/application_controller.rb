class ApplicationController < ActionController::Base
        include DeviseTokenAuth::Concerns::SetUserByToken
  
  # protect_from_forgery with: :null_session  # ONLY FOR API, I haven't api project, cuz all steps of teacher isn't have been behavior the same for me
  # although I did step by step. New version RoR - new behavior of app
  protect_from_forgery unless: -> { request.format.json? }  # to avoid getting errors from failiing CSRF validation

  before_action :configure_permitted_parameters, if: :devise_controller?

  include ActionController::ImplicitRender
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Mongoid::Errors::DocumentNotFound, with: :record_not_found
  
  
  protected
  def full_message_error full_message, status
    payload = {
      errors: { full_messages:["#{full_message}"] }
    }
    render :json=>payload, :status=>status
  end
  
  def record_not_found(exception) 
    payload = {
        errors: { full_messages:["cannot find id[#{params[:id]}]"] }
      }
      render :json=>payload, :status=>:not_found
      Rails.logger.debug exception.message
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end 

  def missing_parameter(exception) 
    payload = {
      errors: { full_messages:["#{exception.message}"] }
    }
    render :json=>payload, :status=>:bad_request
    Rails.logger.debug exception.message
  end

end