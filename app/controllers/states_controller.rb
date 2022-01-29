class StatesController < ApplicationController
  before_action :set_state, only: %i[ show update destroy ]

  # GET /states
  # GET /states.json
  def index
    @states = State.all
  end

  # GET /states/1
  # GET /states/1.json
  def show
  end

  # POST /states
  # POST /states.json
  def create
    @state = State.new(state_params)

    if @state.save
      render :show, status: :created, location: @state
    else
      render json: @state.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /states/1
  # PATCH/PUT /states/1.json
  def update
    if @state.update(state_params)
      render :show, status: :ok, location: @state
    else
      render json: @state.errors, status: :unprocessable_entity
    end
  end

  # DELETE /states/1
  # DELETE /states/1.json
  def destroy
    @state.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_state
      @state = State.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def state_params
      params.require(:state).permit(:name)
    end
end
