import React, {useEffect, useState, us} from "react";
import {createMovimiento} from "../../actions/movimientos";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Loader from "react-loader-spinner";
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import swal from '@sweetalert/with-react';
import ProveedorService from "../../services/ProveedorService";

const currentDate = new Date();
const currentYear = new Date().getFullYear();

const validationSchema = Yup.object().shape({

    fechaDeCobro: Yup.date()
        .typeError('Se debe seleccionar la fecha del movimiento')
        .required('Se debe seleccionar la fecha del movimiento')
        .max(currentDate, 'La fecha de movimiento no puede ser posterior al dia de hoy'),

    medioDePago: Yup.string()
        .typeError('Se debe seleccionar una opción')
        .required('EL medio de de pago del movimiento es requerido'),

    detalle: Yup.string()
        .required('El detalle del movimiento es requrido')
        .matches('^(?!\\s*$).+', {message: 'El detalle del movimiento no puede estar vacío'}),

    monto: Yup.number()
        .typeError('El monto del movimiento debe ser un número')
        .required('El monto del movimiento es requerido')
        .integer('El monto del movimiento debe ser un número')
        .positive('El monto del movimiento debe ser un número válido'),

    tipoMovimiento: Yup.string()
        .typeError('Se debe seleccionar una opción')
        .required('EL tipo de movimiento es requerido'),


});

const navigateFinanzas = `${config.appDns}/finanzas`


function EntradaManualForm(props) {

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            fechaDeCobro: undefined,
            medioDePago: undefined,
            usuarioId: parseInt(localStorage.getItem("usuarioId"),10),
            detalle: '',
            tipoMovimiento: undefined,
            monto: undefined
        }
    });


    const onSubmit = (data) => {
        createMovimiento(data).then((response) => {
            handleResponse(201, response, navigateFinanzas, "El movimiento fue correctamente registrado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateFinanzas, "Hubo un error al registrar el movimiento")
        })
    };

    return (
        <div className="register-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Fecha de Movimiento</label>
                    <input
                        name="fechaDeCobro"
                        type="date"
                        {...register('fechaDeCobro')}
                        className={`form-control ${errors.fechaDeCobro ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.fechaDeCobro?.message}</div>
                </div>
                <div className="form-group">
                    <label>Tipo de Movimiento</label>
                    <select
                        name="tipoMovimiento"
                        {...register('tipoMovimiento')}
                        className={`form-control ${errors.tipoMovimiento ? 'is-invalid' : ''}`}
                    >
                        <option selected value={'ENTRADA_MANUAL'}>Entrada</option>
                        <option value={'SALIDA_MANUAL'}>Salida</option>
                    </select>
                    <div className="invalid-feedback">{errors.tipoMovimiento?.message}</div>
                </div>
                <div className="form-group">
                    <label>Monto</label>
                    <input
                        name="monto"
                        type="text"
                        {...register('monto')}
                        className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.monto?.message}</div>
                </div>


                <div className="form-group">
                    <label>Detalle</label>
                    <input
                        name="detalle"
                        type="text"
                        {...register('detalle')}
                        className={`form-control ${errors.detalle ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.detalle?.message}</div>
                </div>
                <div className="form-group">
                    <label>Medio de Pago</label>
                    <select
                        name="medioDePago"
                        {...register('medioDePago')}
                        className={`form-control ${errors.medioDePago ? 'is-invalid' : ''}`}
                    >
                        <option selected value={'EFECTIVO'}>Efectivo</option>
                        <option value={'TRANSFERENCIA_BANCARIA'}>Transferencia</option>
                        <option value={'MERCADO_PAGO'}>Mercado Pago</option>
                    </select>
                    <div className="invalid-feedback">{errors.medioDePago?.message}</div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
        </div>);
}

export default EntradaManualForm
