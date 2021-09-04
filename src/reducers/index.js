import { combineReducers } from "redux";
import tutorials from "./tutorials";
import profesores from "./profesores"

export default combineReducers({
  tutorials,
  profesores
});
