// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require react/dist/react.min.js
//= require jquery/dist/jquery.min.js
//= require react-dom/dist/react-dom.min.js

window.onload = function(){
  ReactDOM.render(
    React.createElement(TodoApp),document.body
  )
}
//タスクを１つ表示するためのコンポーネント。変更部がサーバーとの通信を含むため、コンポーネントを分割する必要あり。
var List = React.createClass({
  getInitialState: function(){
    return{
      id: this.props.id,
      done: this.props.done,
      plan_date: this.props.plan_date,
      text: this.props.text
    }
  },
  render: function(){
    return(
      <div className="todo">
        <TodoService ref={(todoService)=>{this.todoService=todoService}}></TodoService>
        <div className="todoText">{this.props.text}</div>
        <div className="todoPlanDate">{this.props.plan_date}</div>
        {
          (()=>{if (this.state.done){
            return(<div className="todoDone"><input type="checkbox" onChange={this.onChangedCheck} checked/></div>)
          }else {return(<div className="todoDone"><input type="checkbox" onChange={this.onChangedCheck}/></div>)}})
          ()}
          <div className="todoDelete"><input type="button" value="削除" onClick={this.onClicked}/></div>
        </div>
      )
    },
    onChangedCheck:function(event){
      this.state.done = event.target.checked;
      this.setState(
        this.state
      );
      var todoService = React.createElement(TodoService);
      this.todoService.editList(this.state,function(res){
        console.log(res);
        this.setState(
          this.state
        );
      }.bind(this))
    },
    onClicked:function(){
      var todoService = React.createElement(TodoService);
      this.todoService.deleteList(this.state,function(res){
        console.log(res.id);
        if(this.props.onDelete){
          this.props.onDelete({id:res.id})
        }
      }.bind(this))}
    })

    //ユーザーからの入力を受け付け、入力規則のバリデーションをするコンポーネント
    var TodoInput = React.createClass(
      {
        getInitialState: function(){
          return{
            text: null,
            plan_date: null,
            done: false
          }
        },
        render:function(){
          return(
            <div>
              <TodoService ref={(todoService)=>{this.todoService=todoService}}></TodoService>
              <input type="text" value={this.state.text} onChange={this.onChangedText}/>
              <input type="text" value={this.state.plan_date} onChange={this.onChangedDate}/>
              <input type="button" value="作成" onClick={this.onClicked}/>
            </div>
          )
        },
        onChangedText:function(event){
          this.setState(
            {
              text: event.target.value
            }
          )
        },
        onChangedDate:function(event){
          var newState = this.state;
          newState.plan_date = event.target.value;
          this.setState(
            newState
          )
        },
        onClicked:function(){
          if (this.state.text === null
            || this.state.text === ''
            ||this.state.plan_date === null
            || this.state.plan_date === ''
            || !this.state.plan_date.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)){
              return
            }
            var todoService = React.createElement(TodoService);
            this.todoService.createList(this.state,function(res){
              console.log(res);
              if(this.props.onCreate){
                this.props.onCreate({text:res.text, plan_date:res.plan_date, id:res.id})
              }
              this.state.text = '';
              this.state.plan_date = '';
              this.setState(
                this.state
              )
            }.bind(this))
          }
        }
      )

      //インプットされたタスクをサーバーに送るコンポーネント
      var TodoService = React.createClass({
        createList:function(state,callback){
          $.ajax({
            url: 'http://localhost:3000/todo/create',
            success: callback,
            data: {text:state.text, plan_date:state.plan_date},
            method: "POST"
          })
        },
        editList:function(state,callback){
          $.ajax({
            url: 'http://localhost:3000/todo/edit',
            success: callback,
            data: {text:state.text, plan_date:state.plan_date, id:state.id, done:state.done},
            method: "POST"
          })
        },
        deleteList:function(state,callback){
          $.ajax({
            url: 'http://localhost:3000/todo/delete',
            success: callback,
            data: {id:state.id},
            method: "DELETE"
          })
        },
        render: function(){
          return null;
        }
      }
    )

    //タスクの一覧を表示し、入力部品を設置するコンポーネント。ルートに属するreact component
    var TodoApp = React.createClass({
      propTypes: {},
      getInitialState: function(){
        return{
          lists: []
        }
      },
      componentDidMount: function(){
        this.getLists()
      },
      getLists: function(){
        $.ajax({
          url: 'http://localhost:3000/todo/show',
          success: function(res){
            console.log(res)
            this.setState({
              lists: res
            })
          }.bind(this)
        })
      },
      render: function(){
        var components = this.state.lists.map(
          function(list){
            return(
              <List id={list.id} text={list.text} done={list.done} plan_date={list.plan_date} onDelete={this.onDeleted.bind(this,list.id)}/>
            )
          }.bind(this)
        )
        console.log(components)
        return(<div className="components">
        <TodoInput onCreate={this.onCreated}/>{components}</div>
      )
    },
    onCreated: function(data){
      console.log(data)
      this.getLists()
      this.render()
    },
    onDeleted: function onDeleted(id) {
      var newState = this.state.lists.filter(function (list) {
        console.log(id,list.id);
        return id != list.id;
      });
      console.log(newState);
      this.setState({
        lists: newState
      });
      this.render();
    }
  })
