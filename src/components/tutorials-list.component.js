import React, { Component } from "react";
import { connect } from "react-redux";

import {
  // retrieveTutorials,
  findTutorialsByTitle,
  deleteAllTutorials,
} from "../actions/tutorials";

import {
  retrieveProfesores,
} from "../actions/profesores";
import { Link } from "react-router-dom";

class TutorialsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.findByTitle = this.findByTitle.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);

    this.state = {
      currentProfesor: null,
      currentIndex: -1,
      searchTitle: "",
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

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentProfesor: tutorial,
      currentIndex: index,
    });
  }

  removeAllTutorials() {
    this.props
      .deleteAllTutorials()
      .then((response) => {
        console.log(response);
        this.refreshData();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  findByTitle() {
    this.refreshData();

    this.props.findTutorialsByTitle(this.state.searchTitle);
  }

  render() {
    const { searchTitle, currentProfesor, currentIndex } = this.state;
    const { profesores } = this.props;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por Nombre"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.findByTitle}
              >
                Search
              </button>
            </div>
          </div>
          <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Buscar por curso"
                value={searchTitle}
                onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.findByTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
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
                    onClick={() => this.setActiveTutorial(profesor, index)}
                    key={index}
                  >
                    {profesor.nombreApellido}
                  </li>
                ))}
            </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllTutorials}
          >
            Remove All
          </button>
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
                    onClick={this.findByTitle}
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
  findTutorialsByTitle,
  deleteAllTutorials,
})(TutorialsList);
