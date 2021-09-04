import React, { Component } from "react";
import { connect } from "react-redux";
import { createProfesor } from "../actions/profesores";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {handleResponse} from "../http-common";


const validationSchema = Yup.object().shape({
  nombreApellido: Yup.string().required('El nombre y apellido es requerido'),
  dni: Yup.number()
      .typeError('El DNI debe ser un número')
      .required('DNI es requerido')
      .integer('El DNI debe ser un número')
      .positive('El DNI debe ser un numero válido'),
  edad: Yup.number()
      .typeError('La edad debe ser un número')
      .required('La edad es requerida')
      .integer("La edad debe ser un número")
      .positive('La edad debe ser un numero válido'),

  email: Yup.string()
      .required('El email es requerido')
      .email('El email es invalido'),
  //TODO - resto de las validaciones

});

function AddProfesor2(props){
  const {
  register,
  handleSubmit,
  // reset,
  formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    console.log(JSON.stringify(data, null, 2));
    // console.log("navigation: "+ JSON.stringify(navigation, null, 2))
    console.log("estoy en onSubmit")
    createProfesor(data).then((response) => {
      handleResponse(200,response,"http://localhost:8081/profesores","Hubo un error al agregar el profesor")
    })
  };

    return (
        <div className="register-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Nombre y Apellido </label>
              <input
                  name="nombreApellido"
                  type="text"
                  {...register('nombreApellido')}
                  className={`form-control ${errors.nombreApellido ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.nombreApellido?.message}</div>
            </div>

            <div className="form-group">
              <label>DNI</label>
              <input
                  name="dni"
                  type="text"
                  {...register('dni')}
                  className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.dni?.message}</div>
            </div>

            <div className="form-group">
              <label>Edad</label>
              <input
                  name="edad"
                  type="text"
                  {...register('edad')}
                  className={`form-control ${errors.edad ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.edad?.message}</div>
            </div>

            <div className="form-group">
              <label>Detalles</label>
              <input
                  name="detalles"
                  type="textarea"
                  {...register('detalles')}
                  className={`form-control ${errors.detalles ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.detalles?.message}</div>
            </div>


            <div className="form-group">
              <label>CBU / CVU</label>
              <input
                  name="cbuCvu"
                  type="text"
                  {...register('cbuCvu')}
                  className={`form-control ${errors.cbuCvu ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.cbuCvu?.message}</div>
            </div>

            <div className="form-group">
              <label>Experiencia previa </label>
              <input
                  name="experienciaPrevia"
                  type="text"
                  {...register('experienciaPrevia')}
                  className={`form-control ${errors.experienciaPrevia ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.experienciaPrevia?.message}</div>
            </div>

            <div className="form-group form-check">
              <input
                  name="valorHoraDiferenciado"
                  type="checkbox"
                  {...register('valorHoraDiferenciado')}
                  className={`form-check-input ${
                      errors.valorHoraDiferenciado ? 'is-invalid' : ''
                  }`}
              />
              <label htmlFor="acceptTerms" className="form-check-label">
                Valor de hora diferenciado
              </label>
              <div className="invalid-feedback">{errors.valorHoraDiferenciado?.message}</div>
            </div>

            <div className="form-group">
              <label>Domicilio</label>
              <input
                  name="domicilio"
                  type="text"
                  {...register('domicilio')}
                  className={`form-control ${errors.domicilio ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.domicilio?.message}</div>
            </div>

            <div className="form-group">
              <label>Telefono</label>
              <input
                  name="telefono"
                  type="text"
                  {...register('telefono')}
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.telefono?.message}</div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                  name="email"
                  type="text"
                  {...register('email')}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              {/*<button*/}
              {/*    type="button"*/}
              {/*    onClick={reset}*/}
              {/*    className="btn btn-warning float-right"*/}
              {/*>*/}
              {/*  Limpiar*/}
              {/*</button>*/}
            </div>
          </form>
        </div>);
}

export default AddProfesor2


// class AddProfesor2 extends Component {
//
//   render() {
//         AddProfesorFunc()
//   }
// }
// export default connect(null, { createProfesor })(AddProfesor2);