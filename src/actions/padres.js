import PadresService from "../services/PadresService";

export async function updatePadre(id,data) {
    try {
        console.log("estoy en createPadre")
        const res = await PadresService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createPadre(data) {
    try {
        console.log("estoy en createPadre")
        const res = await PadresService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deletePadre(id){
    try {
        console.log("estoy en deletePadre")
        const res = await PadresService.delete(id);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function getPadres(params) {
    try {
        const res = await PadresService.getAll(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

