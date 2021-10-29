import ClasesService from "../services/ClasesService";

export async function updateClase(id,data) {
    try {
        console.log("estoy en updateClase")
        const res = await ClasesService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createClase(data) {
    try {
        console.log("estoy en createClase")
        const res = await ClasesService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deleteClase(id){
    try {
        console.log("estoy en deleteClase")
        const res = await ClasesService.delete(id);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function getClases(params) {
    try {
        const res = await ClasesService.getAll(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

