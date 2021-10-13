import AlumnoService from "../services/AlumnoService";

export async function updateAlumno(id,data) {
    try {
        console.log("estoy en createAlumno")
        const res = await AlumnoService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createAlumno(data) {
    try {
        console.log("estoy en createAlumno")
        const res = await AlumnoService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function deleteAlumno(id){
    try {
        console.log("estoy en deleteAlumno")
        const res = await AlumnoService.delete(id);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function getAlumnos(params) {
    try {
        const res = await AlumnoService.getAll(params).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
        return Promise.resolve(res);
    } catch (err) {
        console.log(err);
    }
}

