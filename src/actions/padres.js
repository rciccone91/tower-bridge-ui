import PadresService from "../services/PadresService";
import ProfesoresService from "../services/ProfesoresService";

export function findPadresByNombreApellido(nombreApellido) {
}


export async function deletePadre(id){
    try {
        console.log("estoy en deletePadre")
        const res = await ProfesoresService.delete(id);

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

