import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProfesorForm from "./components/ProfesorForm";
import PadreForm from "./components/PadreForm";
import ProfesoresList from "./components/ProfesorList";
import ProfesorDetail from "./components/ProfesorDetail";
import Home from "./components/Home";
import PadresList from "./components/PadreList";
import PadreDetail from "./components/PadreDetail";

class App extends Component {
  render() {
    return (
      <Router>
        <nav className="navbar navbar-expand navbar-dark bg-secondary">
          <Link to={"/home"} className="navbar-brand" >
            Tower Bridge
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/profesores"} className="nav-link">
                Profesores
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/padres"} className="nav-link">
                Padres
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/","/home"]} render={(props) => <Home props={props}/>} />
            <Route exact path={"/profesores"} component={ProfesoresList} />
            <Route path="/profesores/:id" render={(props) => <ProfesorForm props={props.match}/>} />
            <Route path="/profesorForm" component={ProfesorForm}/>
            <Route path="/profesor/detail/:id" render={(props) => <ProfesorDetail props={props.match}/>}/>
            <Route exact path={"/padres"} component={PadresList} />
            <Route path="/padres/:id" render={(props) => <PadreForm props={props.match}/>} />
            <Route path="/padreForm" component={PadreForm}/>
            <Route path="/padre/detail/:id" render={(props) => <PadreDetail props={props.match}/>}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
