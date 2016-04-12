import {todo, TodoEntry} from './api';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export const App = () => (
    <div>
        <AddTodo />
        <TodoList />
        <Footer />
    </div>
);

class AddTodo extends React.Component<any, any> {

    handleSubmit(e) {
        let trimmed, el = document.getElementById("todo-text") as HTMLInputElement;
        e.preventDefault();
        if (trimmed = el.value.trim()) {
            todo.addTodo(trimmed);
            el.value = '';
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input id="todo-text"/>
                    <button type="submit">
                        Add Todo
                    </button>
                </form>
            </div>
        )
    }
}

const Footer = () => (
    <p>
        Show:
        {" "}
        <FilterLink filter={todo.filters.all}>
            All
        </FilterLink>
        {", "}
        <FilterLink filter={todo.filters.active}>
            Active
        </FilterLink>
        {", "}
        <FilterLink filter={todo.filters.completed}>
            Completed
        </FilterLink>
    </p>
);

interface IFilterLinkProps {
    active?: boolean;
    children?: any;
    filter: Function;
}

function filterLinkConnector(state, ownProps: IFilterLinkProps) {
    return {active: ownProps.filter == todo.getFilter()};
}

// Workaround for broken React-Redux typings
const connectFilterLink = (filterLinkClass: any): any => ReactRedux.connect(filterLinkConnector)(filterLinkClass);

@connectFilterLink
class FilterLink extends React.Component<IFilterLinkProps, any> {
    render() {
        if (this.props.active) {
            return <span>{this.props.children}</span>
        }

        return (
            <a href="#" onClick={e => {e.preventDefault(); todo.setFilter(this.props.filter)}}>
                {this.props.children}
            </a>
        )
    }
}

interface ITodoProps {
    onClick: Function;
    todo: TodoEntry;
}

export class Todo extends React.Component<ITodoProps, any> {
    getStyle = () => ({textDecoration: this.props.todo.completed ? 'line-through' : 'none'});

    render() {
        return (
            <li onClick={this.props.onClick} style={this.getStyle()}>
                {this.props.todo.text}
            </li>
        )
    }
}

interface ITodoListProps {
    todos?: TodoEntry[];
    onTodoClick?: Function;
}

function todoListConnector() {
    return {todos: todo.getTodos()}
}

// Workaround for broken React-Redux typings
const connectTodoList = (todoClass: any): any => ReactRedux.connect(todoListConnector)(todoClass);

@connectTodoList
class TodoList extends React.Component<ITodoListProps, any> {
    render() {
        return (
            <ul>
                {this.props.todos.map(todo =>
                    <Todo key={todo.id} todo={todo} onClick={() => this.props.onTodoClick(todo.id)}/>
                )}
            </ul>
        )
    }
}

