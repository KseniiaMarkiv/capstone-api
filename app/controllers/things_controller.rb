class ThingsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  before_action :set_thing, only: %i[show update destroy]
  before_action :authenticate_user!, only: %i[create update destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  wrap_parameters :thing, include: %w[name description notes]
  # GET /things
  # GET /things.json
  def index
    authorize Thing
    @things = policy_scope(Thing.all)
    @things = ThingPolicy.merge(@things)
    # pp @things.map(&:attributes)
  end

  # GET /things/1
  # GET /things/1.json
  def show
    authorize @thing
    things = ThingPolicy::Scope.new(current_user,
                                    Thing.where(:id=>@thing.id))
                                    .user_roles(false)
    @thing = ThingPolicy.merge(things).first
  end

  # POST /things
  # POST /things.json
  def create
    authorize Thing
    @thing = Thing.new(thing_params)

    User.transaction do
      if @thing.save
        role=current_user.add_role(Role::ORGANIZER,@thing)
        @thing.user_roles << role.role_name
        role.save!
        render :show, status: :created, location: @thing
      else
        render json: {errors:@thing.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /things/1
  # PATCH/PUT /things/1.json
  def update
    authorize @thing
    if @thing.update(thing_params)
      head :no_content
    else
      render json: {errors:@thing.errors.messages}, status: :unprocessable_entity
    end
  end

  # DELETE /things/1
  # DELETE /things/1.json
  def destroy
    authorize @thing
    @thing.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_thing
      @thing = Thing.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def thing_params
      params.require(:thing).tap {|p|
        p.require(:name) #throws ActionController::ParameterMissing
      }.permit(:name, :description, :notes)
    end
end
