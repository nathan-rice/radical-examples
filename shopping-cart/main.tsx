import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {store} from './api';
import {App} from './components';

render(<Provider store={store}><App /></Provider>, document.getElementById("root"));