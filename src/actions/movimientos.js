import MovimientosService from "../services/MovimientosService";

export async function updateMovimiento(id,data) {
    try {
        console.log("estoy en updateMovimiento")
        const res = await MovimientosService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createMovimiento(data) {
    try {
        console.log("estoy en createMovimiento")
        const res = await MovimientosService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deleteMovimiento(id){
    try {
        console.log("estoy en deleteMovimiento")
        const res = await MovimientosService.delete(id);

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


