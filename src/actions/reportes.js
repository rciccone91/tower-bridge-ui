import ReportesService from "../services/ReportesService";

export async function getTresMesesAdeudados() {
    try {
        const res = await ReportesService.getTresMesesAdeudadosReport().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}


export async function getClasesDeCursosEspecificosReport() {
    try {
        const res = await ReportesService.getClasesDeCursosEspecificosReport().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}


export async function getAlumnosConMalDesempenioReport() {
    try {
        const res = await ReportesService.getAlumnosConMalDesempenioReport().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}


export async function getExamenInternacionalReport() {
    try {
        const res = await ReportesService.getExamenInternacionalReport().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getDeudaMesActualReport() {
    try {
        const res = await ReportesService.getDeudaMesActualReport().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getPagosProveedoresDelMes() {
    try {
        const res = await ReportesService.getPagosProveedoresDelMes().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getMovimientosManualesDelMes() {
    try {
    const res = await ReportesService.getMovimientosManualesDelMes().catch(err => {
        console.log(err)
        return Promise.reject(err);
    })
    return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getCursosValorExamen() {
    try {
        const res = await ReportesService.getCursosValorExamen().catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

