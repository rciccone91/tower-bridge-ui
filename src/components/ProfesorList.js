import React, { Component } from "react";
import { connect } from "react-redux";
import swal from '@sweetalert/with-react';
import {deleteProfesor} from "../actions/profesores";


import {
  findTutorialsByTitle,
} from "../actions/tutorials";

import {
  retrieveProfesores,
} from "../actions/profesores";
import { Link } from "react-router-dom";
import {handleResponse} from "../http-common";
import config from "../config";

const navigateDeleteOk = `${config.appDns}/profesores`

class ProfesoresList extends Component {


  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveProfesor = this.setActiveProfesor.bind(this);
    this.findByTitle = this.findByTitle.bind(this);
    // this.onCancel = this.onCancel.bind(this);
    this.showConfirmation = this.showConfirmation.bind(this);

    this.state = {
      currentProfesor: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.props.retrieveProfesores();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  refreshData() {
    this.setState({
      currentProfesor: null,
      currentIndex: -1,
    });
  }

  setActiveProfesor(profesor, index) {
    this.setState({
      currentProfesor: profesor,
      currentIndex: index,
    });
  }

  showConfirmation(){
    swal({
      title: "Eliminar",
      text: "Se va a eliminar el profesor "+this.props.currentProfesor.nombreApellido+". Por favor, confirmar dicha acción.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"]
    });
  };

  deleteProfesor(id){
    deleteProfesor(id).then((response) => {
      handleResponse(204,response,navigateDeleteOk,"Hubo un error al eliminar el profesor", "El profesor fue correctamente eliminado.")
    })
  };

  findByTitle() {
    this.refreshData();

    this.props.findTutorialsByTitle(this.state.searchTitle);
  }

  render() {
    const { searchTitle, currentProfesor, currentIndex } = this.state;
    const { profesores } = this.props;

    return (
      <div className="list row">
        {/*<div className="col-md-8">*/}
        {/*  <div className="input-group mb-3">*/}
        {/*    <input*/}
        {/*      type="text"*/}
        {/*      className="form-control"*/}
        {/*      placeholder="Buscar por Nombre"*/}
        {/*      value={searchTitle}*/}
        {/*      onChange={this.onChangeSearchTitle}*/}
        {/*    />*/}
        {/*    <div className="input-group-append">*/}
        {/*      <button*/}
        {/*        className="btn btn-outline-secondary"*/}
        {/*        type="button"*/}
        {/*        onClick={this.findByTitle}*/}
        {/*      >*/}
        {/*        Search*/}
        {/*      </button>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="input-group mb-3">*/}
        {/*    <input*/}
        {/*        type="text"*/}
        {/*        className="form-control"*/}
        {/*        placeholder="Buscar por curso"*/}
        {/*        value={searchTitle}*/}
        {/*        onChange={this.onChangeSearchTitle}*/}
        {/*    />*/}
        {/*    <div className="input-group-append">*/}
        {/*      <button*/}
        {/*          className="btn btn-outline-secondary"*/}
        {/*          type="button"*/}
        {/*          onClick={this.findByTitle}*/}
        {/*      >*/}
        {/*        Search*/}
        {/*      </button>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="col-md-6">
          <h4>Profesores</h4>

            <ul className="list-group row-cols-md-8">
            {profesores &&
              profesores.map((profesor, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActiveProfesor(profesor, index)}
                    key={index}
                  >
                    {profesor.nombreApellido}
                  </li>
                ))}
            </ul>
          <Link
              to={"/profesorForm"}
            className="m-3 btn btn-sm btn-danger"
          >
            Agregar Profesor
          </Link>
        </div>
        <div className="col-md-6">
          {currentProfesor ? (
            <div>
              <h4>Profesor</h4>
              <div>
                <label>
                  <strong>Nombre:</strong>
                </label>{" "}
                {currentProfesor.nombreApellido}
              </div>
              <div>
                <label>
                  <strong>Detalles:</strong>
                </label>{" "}
                {currentProfesor.detalles}
              </div>
              <div>
                <label>
                  <strong>DNI:</strong>
                </label>{" "}
                {currentProfesor.dni}
              </div>


                <Link
                  to={"/profesores/" + currentProfesor.id}
                  className="btn btn-primary btn-sm"
                >
                  Modificar
                </Link>
                <button
                    className="btn btn-danger btn-sm"
                    type="button"
                    onClick={() => swal({
                      title: "Eliminar",
                      text: "Se va a eliminar el profesor "+currentProfesor.nombreApellido+". Por favor, confirmar dicha acción.",
                      icon: "warning",
                      buttons: ["Cancelar", "Eliminar"]
                    }).then(selection => {
                        if(selection){
                          this.deleteProfesor(currentProfesor.id)
                        }
                      })
                    }
                    style={{marginLeft:20}}
                >
                  Eliminar
                </button>
            </div>
          ) : (
            <div>
              <br />
              <p>Por favor, seleccione un profesor...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profesores: state.profesores,
  };
};

export default connect(mapStateToProps, {
  retrieveProfesores,
  findTutorialsByTitle
})(ProfesoresList);