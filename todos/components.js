"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var api = require('./api');
var React = require('react');
var ReactRedux = require('react-redux');
exports.App = function () { return (React.createElement("div", null, React.createElement(AddTodo, null), React.createElement(TodoList, null), React.createElement(Footer, null))); };
var AddTodo = (function (_super) {
    __extends(AddTodo, _super);
    function AddTodo() {
        _super.apply(this, arguments);
    }
    AddTodo.prototype.handleSubmit = function (e) {
        var trimmed, el = document.getElementById("todo-text");
        e.preventDefault();
        if (trimmed = el.value.trim()) {
            api.todo.addTodo(trimmed);
            el.value = '';
        }
    };
    AddTodo.prototype.render = function () {
        return (React.createElement("div", null, React.createElement("form", {onSubmit: this.handleSubmit}, React.createElement("input", {id: "todo-text"}), React.createElement("button", {type: "submit"}, "Add Todo"))));
    };
    return AddTodo;
}(React.Component));
var Footer = function () { return (React.createElement("p", null, "Show:", " ", React.createElement(FilterLink, {filter: api.todo.filters.all}, "All"), ", ", React.createElement(FilterLink, {filter: api.todo.filters.active}, "Active"), ", ", React.createElement(FilterLink, {filter: api.todo.filters.completed}, "Completed"))); };
function filterLinkConnector(state, ownProps) {
    return { active: ownProps.filter == api.todo.getFilter() };
}
var connectFilterLink = function (filterLinkClass) { return ReactRedux.connect(filterLinkConnector)(filterLinkClass); };
var FilterLink = (function (_super) {
    __extends(FilterLink, _super);
    function FilterLink() {
        _super.apply(this, arguments);
    }
    FilterLink.prototype.render = function () {
        var _this = this;
        if (this.props.active) {
            return React.createElement("span", null, this.props.children);
        }
        return (React.createElement("a", {href: "#", onClick: function (e) { e.preventDefault(); api.todo.setFilter(_this.props.filter); }}, this.props.children));
    };
    FilterLink = __decorate([
        connectFilterLink
    ], FilterLink);
    return FilterLink;
}(React.Component));
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        var _this = this;
        _super.apply(this, arguments);
        this.getStyle = function () { return ({ textDecoration: _this.props.todo.completed ? 'line-through' : 'none' }); };
    }
    Todo.prototype.render = function () {
        return (React.createElement("li", {onClick: this.props.onClick, style: this.getStyle()}, this.props.todo.text));
    };
    return Todo;
}(React.Component));
exports.Todo = Todo;
function todoListConnector() {
    return { todos: api.todo.getTodos() };
}
var connectTodoList = function (todoClass) { return ReactRedux.connect(todoListConnector)(todoClass); };
var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        _super.apply(this, arguments);
    }
    TodoList.prototype.render = function () {
        return (React.createElement("ul", null, this.props.todos.map(function (todo) {
            return React.createElement(Todo, {key: todo.id, todo: todo, onClick: function () { return api.todo.toggleTodoCompleted(todo); }});
        })));
    };
    TodoList = __decorate([
        connectTodoList
    ], TodoList);
    return TodoList;
}(React.Component));
//# sourceMappingURL=components.js.map