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

    proveedorId: Yup.number().typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(1, 'Se debe seleccionar una opción'),

    fechaDePago: Yup.date()
        .typeError('Se debe seleccionar la fecha del pago')
        .required('Se debe seleccionar la fecha del pago')
        .max(currentDate, 'La fecha de pago no puede ser posterior al dia de hoy'),

    medioDePago: Yup.string()
        .typeError('Se debe seleccionar una opción')
        .required('EL medio de pago eses requerido'),

    detalle: Yup.string()
        .required('El detalle del pago es requrido')
        .matches('^(?!\\s*$).+', {message: 'El detalle del pago no puede estar vacío'}),

    monto: Yup.number()
        .typeError('El monto del pago debe ser un número')
        .required('El monto del pago es requerido')
        .integer('El monto del pago debe ser un número')
        .positive('El monto del pago debe ser un número válido'),

});

const navigateFinanzas = `${config.appDns}/finanzas`


function PagoForm(props) {

    const [proveedores, setProveedores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            proveedorId: undefined,
            fechaDePago: undefined,
            medioDePago: undefined,
            usuarioId: parseInt(localStorage.getItem("usuarioId"),10),
            detalle: '',
            tipoMovimiento: 'PAGO',
            monto: undefined
            //    COBRO,
            //     PAGO,
            //     ENTRADA_MANUAL,
            //     SALIDA_MANUAL
        }
    });


    const retrieveProveedores = () => {
        ProveedorService.getAll().then(
            res => {
                setProveedores(res.data)
                setIsLoading(false)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los proveedores a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateFinanzas
            })
        });
    };

    useEffect(() => {
        retrieveProveedores();
    }, [])


    const onSubmit = (data) => {
        createMovimiento(data).then((response) => {
            handleResponse(201, response, navigateFinanzas, "El pago fue correctamente registrado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateFinanzas, "Hubo un error al registrar el pago")
        })
    };

    function proveedoresOptions() {
        return proveedores.map(a => <option value={a.id}>{a.nombre}</option>)
    }

    function getProveedoresSelect() {
        return <div className="form-group">
            <label>Proveedor</label>
            <select
                name="proveedorId"
                {...register('proveedorId')}
                className={`form-control ${errors.proveedorId ? 'is-invalid' : ''}`}>
                <option value="0" selected disabled hidden>
                    Seleccione un proveedor
                </option>
                {proveedoresOptions()}
            </select>
            <div className="invalid-feedback">{errors.proveedorId?.message}</div>
        </div>;
    }

    return (
        <div className="register-form">
            {isLoading && <Loader
                type="Rings"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />
            }
            {!isLoading &&
            <form onSubmit={handleSubmit(onSubmit)}>
                {getProveedoresSelect()}
                <div className="form-group">
                    <label>Fecha de pago</label>
                    <input
                        name="fechaDePago"
                        type="date"
                        {...register('fechaDePago')}
                        className={`form-control ${errors.fechaDePago ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.fechaDePago?.message}</div>
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
            }
        </div>);
}

export default PagoForm
