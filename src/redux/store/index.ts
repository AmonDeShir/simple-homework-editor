import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from '../reducers';

const composeEnhancers = composeWithDevTools({
  port: 2137,
  hostname: 'localhost',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export type AppState = ReturnType<typeof rootReducer>;
export default store;
