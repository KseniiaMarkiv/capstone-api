class Api::ThingsController < ApplicationController
  before_action :set_thing, only: %i[ show update destroy ]
  before_action :authenticate_user!, only: %i[create, update, destroy]
  wrap_parameters :thing, include: ["name", "description", "notes"]
  # GET /things
  # GET /things.json
  def index
    @things = Thing.all
  end

  # GET /things/1
  # GET /things/1.json
  def show
  end

  # POST /things
  # POST /things.json
  def create
    @thing = Thing.new(thing_params)

    if @thing.save
      render :show, status: :created, location: @thing
    else
      render json: @thing.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /things/1
  # PATCH/PUT /things/1.json
  def update
    if @thing.update(thing_params)
      render :show, status: :ok, location: @thing
    else
      render json: @thing.errors, status: :unprocessable_entity
    end
  end

  # DELETE /things/1
  # DELETE /things/1.json
  def destroy
    @thing.destroy
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
