import { combineReducers } from "redux";
import tutorials from "./tutorials";
import profesores from "./profesores"
import padres from "./padres"

export default combineReducers({
  tutorials,
  profesores,
  padres
});
