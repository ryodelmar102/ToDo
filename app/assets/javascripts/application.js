

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
  ReactDOM.render(React.createElement(TodoApp), document.body);
};
//タスクを１つ表示するためのコンポーネント。変更部がサーバーとの通信を含むため、コンポーネントを分割する必要あり。
var List = React.createClass({
  displayName: "List",

  getInitialState: function getInitialState() {
    return {
      id: this.props.id,
      done: this.props.done,
      plan_date: this.props.plan_date,
      text: this.props.text
    };
  },
  render: function render() {
    var _this = this;

    return React.createElement(
      "div",
      { className: "todo" },
      React.createElement(TodoService, { ref: function ref(todoService) {
          _this.todoService = todoService;
        } }),
      React.createElement(
        "div",
        { className: "todoText" },
        this.props.text
      ),
      React.createElement(
        "div",
        { className: "todoPlanDate" },
        this.props.plan_date
      ),
      function () {
        if (_this.state.done) {
          return React.createElement(
            "div",
            { className: "todoDone" },
            React.createElement("input", { type: "checkbox", onChange: _this.onChangedCheck, checked: true })
          );
        } else {
          return React.createElement(
            "div",
            { className: "todoDone" },
            React.createElement("input", { type: "checkbox", onChange: _this.onChangedCheck })
          );
        }
      }(),
      React.createElement(
        "div",
        { className: "todoDelete" },
        React.createElement("input", { type: "button", value: "\u524A\u9664", onClick: this.onClicked })
      )
    );
  },
  onChangedCheck: function onChangedCheck(event) {
    this.state.done = event.target.checked;
    this.setState(this.state);
    var todoService = React.createElement(TodoService);
    this.todoService.editList(this.state, function (res) {
      console.log(res);
      this.setState(this.state);
    }.bind(this));
  },
  onClicked: function onClicked() {
    var todoService = React.createElement(TodoService);
    this.todoService.deleteList(this.state, function (res) {
      console.log(res.id);
      if (this.props.onDelete) {
        this.props.onDelete({ id: res.id });
      }
    }.bind(this));
  }
});

//ユーザーからの入力を受け付け、入力規則のバリデーションをするコンポーネント
var TodoInput = React.createClass({
  displayName: "TodoInput",

  getInitialState: function getInitialState() {
    return {
      text: null,
      plan_date: null,
      done: false
    };
  },
  render: function render() {
    var _this2 = this;

    return React.createElement(
      "div",
      null,
      React.createElement(TodoService, { ref: function ref(todoService) {
          _this2.todoService = todoService;
        } }),
      React.createElement("input", { type: "text", value: this.state.text, onChange: this.onChangedText }),
      React.createElement("input", { type: "text", value: this.state.plan_date, onChange: this.onChangedDate }),
      React.createElement("input", { type: "button", value: "\u4F5C\u6210", onClick: this.onClicked })
    );
  },
  onChangedText: function onChangedText(event) {
    this.setState({
      text: event.target.value
    });
  },
  onChangedDate: function onChangedDate(event) {
    var newState = this.state;
    newState.plan_date = event.target.value;
    this.setState(newState);
  },
  onClicked: function onClicked() {
    if (this.state.text === null || this.state.text === '' || this.state.plan_date === null || this.state.plan_date === '' || !this.state.plan_date.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
      return;
    }
    var todoService = React.createElement(TodoService);
    this.todoService.createList(this.state, function (res) {
      console.log(res);
      if (this.props.onCreate) {
        this.props.onCreate({ text: res.text, plan_date: res.plan_date, id: res.id });
      }
      this.state.text = '';
      this.state.plan_date = '';
      this.setState(this.state);
    }.bind(this));
  }
});

//インプットされたタスクをサーバーに送るコンポーネント
var TodoService = React.createClass({
  displayName: "TodoService",

  createList: function createList(state, callback) {
    $.ajax({
      url: 'http://localhost:3000/todo/create',
      success: callback,
      data: { text: state.text, plan_date: state.plan_date },
      method: "POST"
    });
  },
  editList: function editList(state, callback) {
    $.ajax({
      url: 'http://localhost:3000/todo/edit',
      success: callback,
      data: { text: state.text, plan_date: state.plan_date, id: state.id, done: state.done },
      method: "POST"
    });
  },
  deleteList: function deleteList(state, callback) {
    $.ajax({
      url: 'http://localhost:3000/todo/delete',
      success: callback,
      data: { id: state.id },
      method: "DELETE"
    });
  },
  render: function render() {
    return null;
  }
});

//タスクの一覧を表示し、入力部品を設置するコンポーネント。ルートに属するreact component
var TodoApp = React.createClass({
  displayName: "TodoApp",

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
      return React.createElement(List, { id: list.id, text: list.text, done: list.done, plan_date: list.plan_date, onDelete: this.onDeleted.bind(this, list.id) });
    }.bind(this));
    console.log(components);
    return React.createElement(
      "div",
      { className: "components" },
      React.createElement(TodoInput, { onCreate: this.onCreated }),
      components
    );
  },
  onCreated: function onCreated(data) {
    console.log(data);
    this.getLists();
    this.render();
  },
  onDeleted: function onDeleted(id) {
    var newState = this.state.lists.filter(function (list) {
      console.log(id, list.id);
      return id != list.id;
    });
    console.log(newState);
    this.setState({
      lists: newState
    });
    this.render();
  }
});
