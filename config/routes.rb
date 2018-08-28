Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: {format: :json} do
    resource :session, only: [:create, :destroy]
    resources :likes, only: [:create, :destroy, :index]
    resources :users, only: [:show, :create, :index, :update]
    resources :friendships, only: [:create, :destroy, :update]
    resources :comments, only: [:create, :update, :destroy, :index]
    resources :posts, only: [:create, :destroy, :update, :index, :show]

    get '/search/:input', to: 'users#search'
    # search route for now is only for users, so setting
    # the /search for users controller is fine
  end

  root to: 'static_pages#root'
end
