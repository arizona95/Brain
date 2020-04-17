import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist'
import thunkMiddleware from 'redux-thunk';

import { axiosMiddleware } from './middleware';
import createRootReducer from './reducers';
import { client } from './client';


function getComposedEnchancer() {
  const middlewares = [
    routerMiddleware(history),
    axiosMiddleware(client),
    thunkMiddleware,
  ];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  return composeWithDevTools(applyMiddleware(...middlewares));
}


export const history = createHistory();

export default function configureStore(preloadedState) {
  const composedEnhancers = getComposedEnchancer();
  const rootReducer = createRootReducer(history);
  const store = createStore(
    rootReducer,
    preloadedState,
    composedEnhancers,
  );
  const persistor = persistStore(store);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return { store, persistor };
}
