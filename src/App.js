import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProfesorForm from "./components/ProfesorForm";
import ProfesoresList from "./components/ProfesorList";

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
            {/*<li className="nav-item">*/}
            {/*  <Link to={"/profesorForm"} className="nav-link">*/}
            {/*    Add Prof*/}
            {/*  </Link>*/}
            {/*</li>*/}
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/profesores"]} component={ProfesoresList} />
            <Route path="/profesores/:id" render={(props) => <ProfesorForm props={props.match}/>} />/>
            {/*<Route path="/profesorForm" render={(props) => (<ProfesorForm {...props} isAuthed={true} />)} />*/}
            <Route path="/profesorForm" component={ProfesorForm}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
