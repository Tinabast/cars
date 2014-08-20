class ApiController < ApplicationController
  def cars
    response = HTTParty.get("http://www.consumerreports.org/cro/cars/compare-htm/#{params[:state]}/#{params[:mark]}/#{params[:model]}.json")
    render :json => response.body
  end
end
