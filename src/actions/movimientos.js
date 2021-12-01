import MovimientosService from "../services/MovimientosService";

export async function createMovimiento(data) {
    try {
        console.log("estoy en createMovimiento")
        const res = await MovimientosService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deleteMovimiento(id,params){
    try {
        console.log("estoy en deleteMovimiento")
        const res = await MovimientosService.delete(id,params);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function getMovimientos(params) {
    try {
        const res = await MovimientosService.getAll(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getEstadoDeCuenta(params) {
    try {
        const res = await MovimientosService.getEstadoDeCuenta(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getMovimientosPaginated(params) {
    try {
        const res = await MovimientosService.getPaginated(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}


