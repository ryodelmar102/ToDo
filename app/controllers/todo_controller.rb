class TodoController < ApplicationController

	def show
		all_todo = Todo.all
		render :json => all_todo
	end

	def create
		text = params[:text]
		plan_date = params[:plan_date]
		todo = Todo.new
		todo.text = text
		todo.plan_date = plan_date
		todo.save
	end

	def edit
		text = params[:text]
		plan_date = params[:plan_date]
		done = params[:done]
		todo = Todo.find(params[:id])
		todo.text = text
		todo.plan_date = plan_date
		todo.done = done
		todo.save
	end

	def delete
		todo = Todo.find(params[:id])
		todo.destroy
	end

end