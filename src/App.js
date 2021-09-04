import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddTutorial from "./components/add-tutorial.component";
import Tutorial from "./components/tutorial.component";
import TutorialsList from "./components/tutorials-list.component";
import AddProfesor from "./components/AddProfesor";
import AddProfesor2 from "./components/AddProfesor2";

class App extends Component {
  render() {
    return (
      <Router>
        <nav className="navbar navbar-expand navbar-dark bg-secondary">
          <Link to={"/profesores"} className="navbar-brand" >
            Tower Bridge
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/profesores"} className="nav-link">
                Profesores
              </Link>
            </li>
            {/*<li className="nav-item">*/}
            {/*  <Link to={"/add"} className="nav-link">*/}
            {/*    Add*/}
            {/*  </Link>*/}
            {/*</li>*/}
            {/*<li className="nav-item">*/}
            {/*  <Link to={"/addProfesor"} className="nav-link">*/}
            {/*    Add Prof1*/}
            {/*  </Link>*/}
            {/*</li>*/}
            <li className="nav-item">
              <Link to={"/addProfesor2"} className="nav-link">
                Add Prof
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/profesores"]} component={TutorialsList} />
            {/*<Route exact path="/add" component={AddTutorial} />*/}
            <Route path="/profesores/:id" component={Tutorial} />
            {/*<Route path="/addProfesor" component={AddProfesor} />*/}
            <Route path="/addProfesor2" component={AddProfesor2} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
