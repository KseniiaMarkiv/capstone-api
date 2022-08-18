Rails.application.routes.draw do
   
  get 'authn/whoami', defaults: { format: :json }
  get 'authn/checkme'
  mount_devise_token_auth_for 'User', at: 'auth', skip: %i[omniauth_callbacks: confirmable: lockable: timeoutable:]

  namespace :api, defaults: { format: :json } do 
    resources :foos, except: %i[new: edit:]
    resources :bars, except: %i[new: edit:]
    resources :images, except: %i[new: edit:] do 
      post 'thing_images', controller: :thing_images, action: :create
      get 'thing_images', controller: :thing_images, action: :image_things
      get 'linkable_things', controller: :thing_images, action: :linkable_things
    end
    resources :things, except: %i[new: edit:] do 
      resources :thing_images, only: %i[index create update destroy]
    end
  end

  resources :cities
  resources :states

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  get '/ui'  => 'ui#index'
  get '/ui#' => 'ui#index'
  root 'ui#index'
end
