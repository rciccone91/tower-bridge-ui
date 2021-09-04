import React, { Component } from "react";
import { connect } from "react-redux";
import { createProfesor } from "../actions/profesores";
// import Checkbox from 'react'

class AddProfesor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveProfesor = this.saveProfesor.bind(this);
    this.newProfesor = this.newProfesor.bind(this);
    this.validated = this.validated.bind(this)

    this.state = {
      id: null,
      nombreApellido: "",
      errors: {},
      dni: "",
      edad: undefined,
      detalles: "",
      cbuCvu: "",
      experienciaPrevia: "",
      valorHoraDiferenciado: false,
      domicilio: "",
      telefono: "",
      email: "",
      submitted: false,
    };
  }

  validated(){
    if(!this.state.nombreApellido || this.state.nombreApellido === ""){
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          nombreApellido: 'El nombre y apellido es requerido'
        }
      }))
      // this.setState({
      //   ...this.state.errors,
      //   nombreApellido: "El nombre y apellido es requerido"
      // });
      return false;
    }
    return true;
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
  }

  saveProfesor() {
    if(this.validated){
      const {
        nombreApellido,
        dni,
        edad,
        detalles,
        cbuCvu,
        experienciaPrevia,
        valorHoraDiferenciado,
        domicilio,
        telefono,
        email
      } = this.state;

      this.props
          .createProfesor(nombreApellido,
              dni,
              edad,
              detalles,
              cbuCvu,
              experienciaPrevia,
              valorHoraDiferenciado,
              domicilio,
              telefono,
              email)
          .then((data) => {
            this.setState({
              id: data.id,
              nombreApellido: data.nombreApellido,
              dni: data.dni,
              edad: data.edad,
              detalles: data.detalles,
              cbuCvu: data.cbuCvu,
              experienciaPrevia: data.experienciaPrevia,
              valorHoraDiferenciado: data.valorHoraDiferenciado,
              domicilio: data.domicilio,
              telefono: data.telefono,
              email: data.email,
              submitted: true,
            });
            console.log(data);
          })
          .catch((e) => {
            console.log(e);
          });
    }
  }

  newProfesor() {
    this.setState({
      id: null,
      nombreApellido: "",
      errors: {},
      dni: "",
      edad: null,
      detalles: "",
      cbuCvu: "",
      experienciaPrevia: "",
      valorHoraDiferenciado: false,
      domicilio: "",
      telefono: "",
      email: "",
      submitted: false,
    });
  }

  render() {
    return (
        <div className="submit-form">
          {this.state.submitted ? (
              <div>
                <h4>El profesor fue dado de alta!</h4>
                <button className="btn btn-success" onClick={this.newProfesor}>
                  Add
                </button>
              </div>
          ) : (
              <div>
                <div className="form-group">
                  <label htmlFor="nombreApellido">Nombre y Apellido</label>
                  <input
                      type="text"
                      className="form-control"
                      id="nombreApellido"
                      required
                      value={this.state.nombreApellido}
                      onChange={this.handleChange}
                      name="nombreApellido"
                  />
                </div>
                <label className="invalid-feedback">{this.state.errors.nombreApellido}</label>

                <div className="form-group">
                  <label htmlFor="dni">DNI</label>
                  <input
                      type="text"
                      className="form-control"
                      id="dni"
                      required
                      value={this.state.dni}
                      onChange={this.handleChange}
                      name="dni"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edad">Edad</label>
                  <input
                      type="text"
                      className="form-control"
                      id="edad"
                      required
                      value={this.state.edad}
                      onChange={this.handleChange}
                      name="edad"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="detalles">Detalles</label>
                  <input
                      type="textarea"
                      className="form-control"
                      id="detalles"
                      required
                      value={this.state.detalles}
                      onChange={this.handleChange}
                      name="detalles"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cbuCvu">CBU / CVU</label>
                  <input
                      type="text"
                      className="form-control"
                      id="cbuCvu"
                      required
                      value={this.state.cbuCvu}
                      onChange={this.handleChange}
                      name="cbuCvu"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experienciaPrevia">Experiencia previa</label>
                  <input
                      type="textarea"
                      className="form-control"
                      id="experienciaPrevia"
                      required
                      value={this.state.experienciaPrevia}
                      onChange={this.handleChange}
                      name="experienciaPrevia"
                  />
                </div>

                {/*<div className="form-group">*/}
                {/*  <label htmlFor="valorHoraDiferenciado">Valor diferenciado de hora</label>*/}
                {/*  <Checkbox*/}
                {/*      label="Valor diferenciado de hora"*/}
                {/*      name="valorHoraDiferenciado"*/}
                {/*      isSelected={this.state.valorHoraDiferenciado}*/}
                {/*      onCheckboxChange={this.handleChange}*/}
                {/*      key="valorHoraDiferenciado"*/}
                {/*  />*/}
                {/*</div>*/}

                <div className="form-group">
                  <label htmlFor="domicilio">Domicilio</label>
                  <input
                      type="text"
                      className="form-control"
                      id="domicilio"
                      required
                      value={this.state.domicilio}
                      onChange={this.handleChange}
                      name="domicilio"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                      type="text"
                      className="form-control"
                      id="telefono"
                      required
                      value={this.state.telefono}
                      onChange={this.handleChange}
                      name="telefono"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                      type="text"
                      className="form-control"
                      id="email"
                      required
                      value={this.state.email}
                      onChange={this.handleChange}
                      name="email"
                  />
                </div>

                <button onClick={this.saveProfesor} className="btn btn-success">
                  Guardar
                </button>
              </div>
          )}
        </div>
    );
  }
}

export default connect(null, { createProfesor })(AddProfesor);
