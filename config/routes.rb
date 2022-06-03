Rails.application.routes.draw do
  get 'authn/whoami'
  get 'authn/checkme'
  mount_devise_token_auth_for 'User', at: 'auth', skip: %i[omniauth_callbacks: confirmable: lockable: timeoutable:]

  
  namespace :api, defaults: {format: :json} do 
    resources :foos, except: %i[new: edit:]
    resources :bars, except: %i[new: edit:]
  end

  resources :cities
  resources :states

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  get '/ui'  => 'ui#index'
  get '/ui#' => 'ui#index'
  root 'ui#index'
end
