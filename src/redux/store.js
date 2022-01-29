import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "./root-reducer";

export const store = createStore(rootReducer, applyMiddleware(logger, thunk));
