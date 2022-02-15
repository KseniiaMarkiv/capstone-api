class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session  # ONLY FOR API, I haven't api project, cuz all steps of teacher isn't have been behavior the same for me
  # although I did step by step. New version RoR - new behavior of app
end