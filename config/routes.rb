Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: {format: :json} do
    resources :users, only: [:show, :create, :index, :update]
    resource :session, only: [:create, :destroy]
    resources :posts, only: [:create, :destroy, :update, :index, :show]
    resources :comments, only: [:create, :update, :destroy, :index]
    resources :friendships, only: [:create, :destroy, :update]
  end


  root to: 'static_pages#root'
end
