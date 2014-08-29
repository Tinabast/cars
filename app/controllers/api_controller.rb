class ApiController < ApplicationController
  def cars
  	if params[:type]
      response = HTTParty.get("http://www.consumerreports.org/cro/cars/compare-htm/#{params[:state]}/#{params[:mark]}/#{params[:year]}/#{params[:model]}/#{params[:type]}.json")
    elsif params[:year]
      response = HTTParty.get("http://www.consumerreports.org/cro/cars/compare-htm/#{params[:state]}/#{params[:mark]}/#{params[:year]}/#{params[:model]}.json")
    else
	    response = HTTParty.get("http://www.consumerreports.org/cro/cars/compare-htm/#{params[:state]}/#{params[:mark]}/#{params[:model]}.json")
    end
    render :json => response.body
  end
end
