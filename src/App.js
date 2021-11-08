import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
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
import UsuariosService from "./services/UsuariosService";
import swal from "@sweetalert/with-react";
import config from "./config";
import CursosList from "./components/cursos/CursosList";
import CursoForm from "./components/cursos/CursoForm";
import CursoDetail from "./components/cursos/CursoDetail";
import Finanzas from "./components/finanzas/Finanzas";
import CobroForm from "./components/finanzas/CobroForm";
import PagoForm from "./components/finanzas/PagoForm";
import EntradaManualForm from "./components/finanzas/EntradaManualForm";
import ConsultarCaja from "./components/finanzas/ConsultarCaja";
import EliminarRegistracionMovimiento from "./components/finanzas/EliminarRegistracionMovimiento";

const navigateHome = `${config.appDns}/home`
const admin = 'ADMIN'
const profesor = 'PROFESOR'
const alumno = 'ALUMNO'

const App = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState()
    const [usuarioId, setUsuarioId] = useState()
    const [profile, setProfile] = useState()
    const [id, setId] = useState()

    const handleSubmit = async e => {
        e.preventDefault();
        const user = {username, password};
        // send the username and password to the server
        UsuariosService.login(user).then(
            res => {
                // set the state of the user
                setUser(res.data.username)
                setProfile(res.data.perfil)
                setId(res.data.id)
                setUsuarioId(res.data.usuarioId)
                // store the user in localStorage
                localStorage.setItem('user', res.data.username)
                localStorage.setItem('profile', res.data.perfil)
                localStorage.setItem('id', res.data.id)
                localStorage.setItem('usuarioId', res.data.usuarioId)
                console.log(res.data)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: err.data.errorMessage,
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateHome
            })
        });
    };

    const handleLogout = () => {
        setId()
        setUser({});
        setProfile({});
        setUsername("");
        setPassword("");
        localStorage.clear();
        window.location = navigateHome
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        const loggedInUserProfile = localStorage.getItem("profile");
        if (loggedInUser && loggedInUserProfile) {
            setUser(loggedInUser);
            setProfile(loggedInUserProfile);
        }
    }, []);

    return (
        <div>
            {user &&
            <Router>
                <nav className="navbar navbar-expand navbar-dark bg-secondary">
                    <Link to={"/home"} className="navbar-brand">
                        Tower Bridge
                    </Link>
                    <ul className="navbar-nav mr-auto">
                        {profile === admin &&
                        <li className="nav-item">
                            <Link to={"/profesores"} className="nav-link">
                                Profesores
                            </Link>
                        </li>}
                        {(profile === admin || profile === profesor) &&
                        <li className="nav-item">
                            <Link to={"/padres"} className="nav-link">
                                Padres
                            </Link>
                        </li>}
                        {(profile === admin || profile === profesor) &&
                        <li className="nav-item">
                            <Link to={"/alumnos"} className="nav-link">
                                Alumnos
                            </Link>
                        </li>}
                        {profile === admin &&
                        <li className="nav-item">
                            <Link to={"/usuarios"} className="nav-link">
                                Usuarios
                            </Link>
                        </li>
                        }
                        {(profile === admin || profile === profesor) &&
                        <li className="nav-item">
                            <Link to={"/reportes"} className="nav-link">
                                Reportes
                            </Link>
                        </li>
                        }
                        {profile === admin &&
                        <li className="nav-item">
                            <Link to={"/clases"} className="nav-link">
                                Clases
                            </Link>
                        </li>
                        }
                        {profile === profesor &&
                        <li className="nav-item">
                            <Link to={"/mis-clases-dictadas"} className="nav-link">
                                Clases
                            </Link>
                        </li>
                        }
                        {profile === alumno &&
                        <li className="nav-item">
                            <Link to={"/mis-clases"} className="nav-link">
                                Clases
                            </Link>
                        </li>
                        }
                        {profile === admin &&
                        <li className="nav-item">
                            <Link to={"/cursos"} className="nav-link">
                                Cursos
                            </Link>
                        </li>
                        }
                        {profile === profesor &&
                        <li className="nav-item">
                            <Link to={"/cursos-consulta"} className="nav-link">
                                Cursos
                            </Link>
                        </li>
                        }
                        {profile === admin &&
                        <li className="nav-item">
                            <Link to={"/finanzas"} className="nav-link">
                                Finanzas
                            </Link>
                        </li>
                        }
                    </ul>
                    <ul className="form-inline my-2 my-lg-0">
                        <button onClick={handleLogout} className="btn btn-outline-light my-2 my-sm-0"
                                type="submit">Logout
                        </button>
                    </ul>

                </nav>

                <div className="container mt-3">
                    <Switch>
                        <Route exact path={["/", "/home"]} render={(props) => <Home props={props}/>}/>

                        {profile === admin && (<Route exact path={"/profesores"} component={ProfesoresList}/>)}
                        {profile === admin && (
                            <Route path="/profesores/:id" render={(props) => <ProfesorForm props={props.match}/>}/>)}
                        {profile === admin && (<Route path="/profesorForm" component={ProfesorForm}/>)}
                        {profile === admin && (<Route path="/profesor/detail/:id"
                                                      render={(props) => <ProfesorDetail props={props.match}/>}/>)}

                        (profile === admin || profile === profesor) && (<Route exact path={"/padres"}
                                                                               component={PadresList}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/padres/:id"
                                                                               render={(props) => <PadreForm
                                                                                   props={props.match}/>}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/padreForm" component={PadreForm}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/padre/detail/:id"
                                                                               render={(props) => <PadreDetail
                                                                                   props={props.match}/>}/>)}

                        (profile === admin || profile === profesor) && (<Route exact path={"/alumnos"}
                                                                               component={AlumnosList}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/alumnos/:id"
                                                                               render={(props) => <AlumnoForm
                                                                                   props={props.match}/>}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/alumnoForm"
                                                                               component={AlumnoForm}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/alumno/detail/:id"
                                                                               render={(props) => <AlumnoDetail
                                                                                   props={props.match}/>}/>)}

                        {profile === admin && (<Route exact path={"/usuarios"} component={UsuariosList}/>)}
                        {profile === admin && (
                            <Route path="/usuarios/:id" render={(props) => <UsuarioForm props={props.match}/>}/>)}
                        {profile === admin && (<Route path="/usuarioForm" component={UsuarioForm}/>)}
                        // TODO -Ver usuario

                        (profile === admin || profile === profesor) && (<Route path="/reportes" component={Reportes}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report3"
                                                                               component={ExamentInternacionalReport}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report2"
                                                                               component={DeudaMesActualReport}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report4"
                                                                               component={AlumnosConMalDesempenioReport}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report5"
                                                                               component={PagosProveedoresDelMesReport}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report6"
                                                                               component={MovimientosManualesDelMesReport}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report10"
                                                                               component={ClasesDeCursosEspecificosReport}/>)}
                        (profile === admin || profile === profesor) && (<Route path="/report11"
                                                                               component={ValorExamenInternacionalReport}/>)}

                        {profile === admin && (<Route exact path={"/clases"} component={ClasesList}/>)}
                        {profile === admin && (
                            <Route path="/clases/:id" render={(props) => <ClaseForm props={props.match}/>}/>)}
                        {profile === admin && (<Route path={"/claseForm"} component={ClaseForm}/>)}
                        {(profile === admin || profile === profesor || profile === alumno) && (
                            <Route path="/clase/detail/:id" render={(props) => <ClaseDetail props={props.match}/>}/>)}


                        //TODO - hacer el form de clases asignadas para cada uno
                        {profile === profesor && (<Route exact path={"/mis-clases-dictadas"} render={() => <ClasesList props={{'profesorId': id}}/>}/>)}
                        {profile === alumno && (<Route exact path={"/mis-clases"} render={() => <ClasesList props={{'alumnoId': id}}/>}/>)}


                        {profile === admin && (<Route exact path={"/cursos"} component={CursosList}/>)}
                        {profile === admin && (
                            <Route exact path={"/cursos/:id"} render={(props) => <CursoForm props={props.match}/>}/>)}
                        {profile === admin && (<Route exact path={"/cursoForm"} component={CursoForm}/>)}
                        (profile === admin && (<Route path="/curso/detail/:id" render={(props) => <CursoDetail
                        props={props.match}/>}/>)}
                        {profile === profesor && (<Route exact path={"/cursos-consulta"}
                                                         render={() => <CursosList props={{'consulta': true}}/>}/>)}

                        {profile === admin && (<Route exact path={"/finanzas"} component={Finanzas}/>)}
                        {profile === admin && (<Route exact path={"/registrar-cobro"} component={CobroForm}/>)}
                        {profile === admin && (<Route exact path={"/registrar-pago"} component={PagoForm}/>)}
                        {profile === admin && (<Route exact path={"/registrar-movimiento"} component={EntradaManualForm}/>)}
                        {profile === admin && (<Route exact path={"/consultar-caja"} component={ConsultarCaja}/>)}
                        {profile === admin && (<Route exact path={"/eliminar-cobro"} render={() => <EliminarRegistracionMovimiento props={{'tipoMovimiento': 'COBRO'}}/>}/>)}
                        {profile === admin && (<Route exact path={"/eliminar-pago"} render={() => <EliminarRegistracionMovimiento props={{'tipoMovimiento': 'PAGO'}}/>}/>)}


                        <Redirect from='*' to='/home'/>
                    </Switch>
                </div>
            </Router>}
            {!user &&
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    value={username}
                    placeholder="Ingresar usuario"
                    onChange={({target}) => setUsername(target.value)}
                />
                <div>
                    <label htmlFor="password">password: </label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Ingresar password"
                        onChange={({target}) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            }
        </div>
    );
}

export default App;
