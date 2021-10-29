import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProfesorForm from "./components/profesores/ProfesorForm";
import PadreForm from "./components/padres/PadreForm";
import ProfesoresList from "./components/profesores/ProfesorList";
import ProfesorDetail from "./components/profesores/ProfesorDetail";
import Home from "./components/Home";
import PadresList from "./components/padres/PadreList";
import PadreDetail from "./components/padres/PadreDetail";
import AlumnosList from "./components/alumnos/AlumnoList";
import AlumnoForm from "./components/alumnos/AlumnoForm";
import AlumnoDetail from "./components/alumnos/AlumnoDetail";
import UsuariosList from "./components/usuarios/UsuarioList";
import UsuarioForm from "./components/usuarios/UsuarioForm";
import Reportes from "./components/reportes/Reportes";
import ExamentInternacionalReport from "./components/reportes/ExamentInternacionalReport";
import DeudaMesActualReport from "./components/reportes/DeudaMesActualReport";
import AlumnosConMalDesempenioReport from "./components/reportes/AlumnosConMalDesempenioReport";
import PagosProveedoresDelMesReport from "./components/reportes/PagosProveedoresDelMesReport";
import MovimientosManualesDelMesReport from "./components/reportes/MovimientosManualesDelMesReport";
import ClasesDeCursosEspecificosReport from "./components/reportes/ClasesDeCursosEspecificosReport";
import ClasesList from "./components/clases/ClaseList";
import ClaseForm from "./components/clases/ClaseForm";
import ClaseDetail from "./components/clases/ClaseDetail";
import ValorExamenInternacionalReport from "./components/reportes/ValorExamenInternacionalReport";

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
            <li className="nav-item">
              <Link to={"/alumnos"} className="nav-link">
                Alumnos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/usuarios"} className="nav-link">
                Usuarios
              </Link>
            </li>
            <li className="nav-item" >
              <Link to={"/reportes"} className="nav-link">
                Reportes
              </Link>
            </li>
            <li className="nav-item" >
              <Link to={"/clases"} className="nav-link">
                Clases
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

            <Route exact path={"/alumnos"} component={AlumnosList} />
            <Route path="/alumnos/:id" render={(props) => <AlumnoForm props={props.match}/>} />
            <Route path="/alumnoForm" component={AlumnoForm}/>
            <Route path="/alumno/detail/:id" render={(props) => <AlumnoDetail props={props.match}/>}/>

            <Route exact path={"/usuarios"} component={UsuariosList} />
            <Route path="/usuarios/:id" render={(props) => <UsuarioForm props={props.match}/>} />
            <Route path="/usuarioForm" component={UsuarioForm}/>
            {/*<Route path="/alumno/detail/:id" render={(props) => <AlumnoDetail props={props.match}/>}/>*/}

            <Route path="/reportes" component={Reportes}/>
            <Route path="/report3" component={ExamentInternacionalReport}/>
            <Route path="/report2" component={DeudaMesActualReport}/>
            <Route path="/report4" component={AlumnosConMalDesempenioReport}/>
            <Route path="/report5" component={PagosProveedoresDelMesReport}/>
            <Route path="/report6" component={MovimientosManualesDelMesReport}/>
            <Route path="/report10" component={ClasesDeCursosEspecificosReport}/>
            <Route path="/report11" component={ValorExamenInternacionalReport}/>

            <Route exact path={"/clases"} component={ClasesList} />
            <Route path="/clases/:id" render={(props) => <ClaseForm props={props.match}/>} />
            <Route path={"/claseForm"} component={ClaseForm} />
            <Route path="/clase/detail/:id" render={(props) => <ClaseDetail props={props.match}/>}/>

          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
