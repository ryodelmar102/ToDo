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
    React.createElement(Hello),document.body
  )
}

var List = React.createClass({
  getInitialState: function(){
    return{
      id: null,
      done: null,
      plan_date: null,
      test: null
    }
  },
  render: function(){
    return(
      <div>
        <div>{this.props.id}</div>
        <div>{this.props.text}</div>
          <div>{this.props.plan_date}</div>
        <div>{this.props.done}</div>
      </div>
    )
  }
})

var Hello = React.createClass({
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
          <List id={list.id} text={list.text} done={list.done} plan_date={list.plan_date}/>
        )
      }
    )
    console.log(components)
    return(<div>{components}</div>
  )
}
})
