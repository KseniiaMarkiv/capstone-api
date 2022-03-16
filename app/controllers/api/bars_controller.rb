class Api::BarsController < ApplicationController
  before_action :set_api_bar, only: %i[ show edit update destroy ]

  # GET /api/bars or /api/bars.json
  def index
    @api_bars = Api::Bar.all
  end

  # GET /api/bars/1 or /api/bars/1.json
  def show
  end

  # GET /api/bars/new
  def new
    @api_bar = Api::Bar.new
  end

  # GET /api/bars/1/edit
  def edit
  end

  # POST /api/bars or /api/bars.json
  def create
    @api_bar = Api::Bar.new(api_bar_params)

    respond_to do |format|
      if @api_bar.save
        format.html { redirect_to api_bar_url(@api_bar), notice: "Bar was successfully created." }
        format.json { render :show, status: :created, location: @api_bar }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @api_bar.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/bars/1 or /api/bars/1.json
  def update
    respond_to do |format|
      if @api_bar.update(api_bar_params)
        format.html { redirect_to api_bar_url(@api_bar), notice: "Bar was successfully updated." }
        format.json { render :show, status: :ok, location: @api_bar }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @api_bar.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/bars/1 or /api/bars/1.json
  def destroy
    @api_bar.destroy

    respond_to do |format|
      format.html { redirect_to api_bars_url, notice: "Bar was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_bar
      @api_bar = Api::Bar.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_bar_params
      params.require(:api_bar).permit(:name)
    end
end
