class TodoController < ApplicationController

	def show
		all_todo = Todo.all
		render :json => all_todo
	end

	def create
		text = params[:text]
		plan_date = params[:plan_date]
		new_todo = Todo.create(:text=>text, :plan_date=>plan_date)
		render :json => new_todo
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
		render :json => {id:params[:id]}
	end

end
