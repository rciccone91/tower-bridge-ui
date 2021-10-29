import React, { useEffect } from "react";
import {createPadre, updatePadre} from "../../actions/padres";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import PadresService from "../../services/PadresService";
import swal from '@sweetalert/with-react';


const validationSchema = Yup.object().shape({
  nombreApellido: Yup.string()
      .required('El nombre y apellido es requerido')
      .matches('^(?!\\s*$).+',{message: 'El nombre y apellido no puede estar vacío'}),
  dni: Yup.number()
      .typeError('El DNI debe ser un número')
      .required('DNI es requerido')
      .max(200000000, 'El DNI debe ser un numero válido')
      .integer('El DNI debe ser un número')
      .positive('El DNI debe ser un numero válido'),

  email: Yup.string()
      .required('El email es requerido')
      .email('El email es invalido'),

  domicilio: Yup.string()
      .required('El domicilio es requerido.')
      .matches('^(?!\\s*$).+',{message: 'El domicilio no puede estar vacío'}),

  telefono: Yup.string()
      .required('El teléfono es requerido.')
      .matches('^(?!\\s*$).+',{message: 'El teléfono no puede estar vacío'}),

});

const navigatePadres = `${config.appDns}/padres`

function PadreForm(props){

  const id = props && props.props ? props.props.params.id : undefined

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombreApellido:"",
      dni:"",
      detalles:"",
      domicilio:"",
      telefono:"",
      email:""
    }});

  useEffect(() => {
    if(id){
      PadresService.get(id).then(
          res =>  {
              reset(res.data)
          }).catch(err => {
            console.log(err)
            swal({
              title: "Error",
              text: 'Un error ocurrió al buscar el padre requerido. Por favor verificá que el mismo exista o contacta al administrador.',
              icon: "error",
              button: "OK"
            }).then(() => {
              window.location = navigatePadres
            })
      });
    }
  },[id,reset])


  const onSubmit = (data) => {
    if(id){
      updatePadre(id,data).then((response) => {
        handleResponse(200,response,navigatePadres, "El padre fue correctamente actualizado.")
      }).catch(err => {
        console.log(err)
        handleError(err,navigatePadres,"Hubo un error al actualizar el padre")
      })
    } else {
      createPadre(data).then((response) => {
        handleResponse(201,response,navigatePadres, "El padre fue correctamente dado de alta.")
      }).catch(err => {
        console.log(err)
        handleError(err,navigatePadres,"Hubo un error al agregar el padre")
      })
    }
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
              <label>Teléfono</label>
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
            </div>
          </form>
        </div>);
}

export default PadreForm
