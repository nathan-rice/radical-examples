"use strict";
var React = require('react');
var react_dom_1 = require('react-dom');
var react_redux_1 = require('react-redux');
var api_1 = require('./api');
var components_1 = require('./components');
react_dom_1.render(React.createElement(react_redux_1.Provider, {store: api_1.store}, React.createElement(components_1.App, null)), document.getElementById("root"));
//# sourceMappingURL=main.js.map