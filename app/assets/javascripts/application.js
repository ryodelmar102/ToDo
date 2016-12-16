
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

window.onload = function () {
  ReactDOM.render(React.createElement(Hello), document.body);
};

var List = React.createClass({
  displayName: 'List',

  getInitialState: function getInitialState() {
    return {
      id: null,
      done: null,
      plan_date: null,
      test: null
    };
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        null,
        this.props.id
      ),
      React.createElement(
        'div',
        null,
        this.props.text
      ),
      React.createElement(
        'div',
        null,
        this.props.plan_date
      ),
      React.createElement(
        'div',
        null,
        this.props.done
      )
    );
  }
});

var Hello = React.createClass({
  displayName: 'Hello',

  propTypes: {},
  getInitialState: function getInitialState() {
    return {
      lists: []
    };
  },
  componentDidMount: function componentDidMount() {
    this.getLists();
  },
  getLists: function getLists() {
    $.ajax({
      url: 'http://localhost:3000/todo/show',
      success: function (res) {
        console.log(res);
        this.setState({
          lists: res
        });
      }.bind(this)
    });
  },
  render: function render() {
    var components = this.state.lists.map(function (list) {
      return React.createElement(List, { id: list.id, text: list.text, done: list.done, plan_date: list.plan_date });
    });
    console.log(components);
    return React.createElement(
      'div',
      null,
      components
    );
  }
});
