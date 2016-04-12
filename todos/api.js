"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Radical = require('radical');
var Redux = require('redux');
var TodoApi = (function (_super) {
    __extends(TodoApi, _super);
    function TodoApi() {
        _super.apply(this, arguments);
        this.nextTodo = 0;
        this.filters = {
            all: function (todo) { return true; },
            active: function (todo) { return !todo.completed; },
            completed: function (todo) { return todo.completed; }
        };
        this.defaultState = { todos: [], todoFilter: this.filters.all };
        this.addTodo = Radical.Action.create({
            initiator: function (action, text) {
                return action.dispatch({ todo: new TodoEntry(this.nextTodo++, text) });
            },
            reducer: function (state, action) {
                state.todos = state.todos.concat([action.todo]);
                return state;
            }
        });
        this.deleteTodo = Radical.Action.create({
            initiator: function (action, todo) {
                return action.dispatch({ todo: todo });
            },
            reducer: function (state, action) {
                state.todos = state.todos.filter(function (todo) { return action.todo.id != todo.id; });
                return state;
            }
        });
        this.toggleTodoCompleted = Radical.Action.create({
            initiator: function (action, todo) {
                return action.dispatch({ todo: todo });
            },
            reducer: function (state, action) {
                state.todos = state.todos.map(function (todo) {
                    if (todo.id == action.todo.id)
                        return new TodoEntry(todo.id, todo.text, !todo.completed);
                    return todo;
                });
                return state;
            }
        });
        this.setFilter = Radical.Action.create(function (action, filter) {
            return action.dispatch({ todoFilter: filter });
        });
    }
    TodoApi.prototype.getTodos = function () {
        var state = this.getState();
        return state.todos.filter(state.todoFilter);
    };
    ;
    TodoApi.prototype.getFilter = function () {
        return this.getState().todoFilter;
    };
    return TodoApi;
}(Radical.Namespace));
var TodoEntry = (function () {
    function TodoEntry(id, text, completed) {
        if (text === void 0) { text = ""; }
        if (completed === void 0) { completed = false; }
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
    return TodoEntry;
}());
exports.TodoEntry = TodoEntry;
exports.store = Redux.createStore(function (state) { return state; });
exports.todo = TodoApi.create({ getState: exports.store.getState, dispatch: exports.store.dispatch });
exports.store.replaceReducer(exports.todo.reduce);
//# sourceMappingURL=api.js.map