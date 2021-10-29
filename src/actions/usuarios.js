import UsuariosService from "../services/UsuariosService";

export async function updateUsuario(id,data) {
    try {
        console.log("estoy en updateUsuario")
        const res = await UsuariosService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createUsuario(data) {
    try {
        console.log("estoy en createUsuario")
        const res = await UsuariosService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deleteUsuario(id){
    try {
        console.log("estoy en deleteUsuario")
        const res = await UsuariosService.delete(id);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function getUsuarios(params) {
    try {
        const res = await UsuariosService.getAll(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

