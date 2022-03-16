class Api::FoosController < ApplicationController
  before_action :set_foo, only: %i[ show update destroy ]
  wrap_parameters :foo, include: ["name"]

  # GET /foos
  # GET /foos.json
  def index
    @foos = Foo.all
  end

  # GET /foos/1
  # GET /foos/1.json
  def show
  end

  # POST /foos
  # POST /foos.json
  def create
    @foo = Foo.new(foo_params)

    if @foo.save
      head :created
      # render json: @foo, status: :created, location: @foo
      # render :show, status: :created, location: @foo
    else
      render json: @foo.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /foos/1
  # PATCH/PUT /foos/1.json
  def update
    if @foo.update(foo_params)
      head :ok
      # render :show, status: :ok, location: @foo
    else
      render json: @foo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /foos/1
  # DELETE /foos/1.json
  def destroy
    @foo.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_foo
      @foo = Foo.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def foo_params
      params.require(:foo).permit(:name)
    end
end
