import CursosService from "../services/CursosService";

export async function updateCurso(id,data) {
    try {
        console.log("estoy en updateCurso")
        const res = await CursosService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createCurso(data) {
    try {
        console.log("estoy en createCurso")
        const res = await CursosService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deleteCurso(id){
    try {
        console.log("estoy en deleteCurso")
        const res = await CursosService.delete(id);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function getCursos(params) {
    try {
        const res = await CursosService.getAll(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

