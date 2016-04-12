import * as Radical from 'radical';
import * as Redux from 'redux';

class TodoApi extends Radical.Namespace {
    nextTodo = 0;
    filters = {
        all: todo => true,
        active: todo => !todo.completed,
        completed: todo => todo.completed
    };
    defaultState = {todos: [], todoFilter: this.filters.all};
    
    addTodo = Radical.Action.create({
        initiator: function (action, text) {
            return action.dispatch({todo: new TodoEntry(this.nextTodo++, text)});
        },
        reducer: function (state, action) {
            state.todos = [...state.todos, action.todo];
            return state;
        }
    });
    
    deleteTodo = Radical.Action.create({
        initiator: function (action, todo) {
            return action.dispatch({todo: todo});
        },
        reducer: function (state, action) {
            state.todos = state.todos.filter(todo => action.todo.id != todo.id);
            return state;
        }
    });
    
    toggleTodoCompleted = Radical.Action.create({
        initiator: function (action, todo) {
            return action.dispatch({todo: todo});
        },
        reducer: function (state, action) {
            state.todos = state.todos.map(todo => {
                if (todo.id == action.todo.id) return new TodoEntry(todo.id, todo.text, !todo.completed);
                return todo;
            });
            return state;
        }
    });
    
    getTodos() {
        let state = this.getState();
        return state.todos.filter(state.todoFilter);
    };
    
    setFilter = Radical.Action.create(function (action, filter) {
        return action.dispatch({todoFilter: filter});
    });
    
    getFilter() {
        return this.getState().todoFilter;
    }
}

export class TodoEntry {
    constructor(public id: number, public text: string = "", public completed: boolean = false) {}
}

export var store = Redux.createStore(state => state);
export var todo = TodoApi.create({getState: store.getState, dispatch: store.dispatch}) as TodoApi;

store.replaceReducer(todo.reduce);