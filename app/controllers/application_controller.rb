class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session  # ONLY FOR API, I haven't api project, cuz all steps of teacher isn't have been behavior the same for me
  # although I did step by step. New version RoR - new behavior of app
  include ActionController::ImplicitRender
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  protected

  def record_not_found(exception) 
    payload = {
        errors: { full_messages:["cannot find id[#{params[:id]}]"] }
      }
      render :json=>payload, :status=>:not_found
      Rails.logger.debug exception.message
  end
end