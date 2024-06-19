let URL = "http://localhost:3006/p3";

export function url_api() {
    return URL;
}

export const InicioSesion = async (data) => {
    const headers = {
        "Accept": 'aplication/json',
        "Content-Type": 'application/json'
    };
    const datos = await (await fetch(URL + "/inicio", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })).json();
    return datos;
}

export const GuardarImages = async (recurso, data, key) => {
    console.log('llega');
    console.log("ooooooooooooo",data);
    const headers = {
        "news-token": key,
    };
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: data, // Envía el FormData directamente como cuerpo
    };
    try {
        const response = await fetch(URL + recurso, requestOptions);

        const datos = await response.json();

        return datos;
    } catch (error) {
        console.log("Error:", error);
        throw error;
    }
}

/**export async function obtener (recurso){
    const response = await fetch (URL + recurso);
    return await response.json();
}*/

export const obtener = async (recurso, key = '') => {
    let cabeceras = []
    if (key != '') {
        cabeceras = {
            "Accept": 'aplication/json',
            "Content-Type": 'application/json',
            "news-token": key
        };
    } else {
        cabeceras = {
            "Accept": 'aplication/json',
            "Content-Type": 'application/json'
        };
    }
    const datos = await (await fetch(URL + recurso, {
        method: "GET",
        headers: cabeceras
    })).json();
    console.log("dooot", datos);
    return datos;
}

export const enviar = async (recurso, data, key = '') => {
    let headers = []
    if (key != '') {
        headers = {
            "Accept": 'aplication/json',
            "Content-Type": 'application/json',
            "news-token": key
        };
    } else {
        headers = {
            "Accept": "application/json",
        };
    }
    const response = await fetch(URL + recurso, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });
    console.log("datoooos", data);
    return await response.json();
}

export const ObtenerAuto = async (key) => {
    const cabeceras = {
        "news-token": key,
        "Accept": 'aplication/json',
        "Content-Type": 'application/json'
    };
    const datos = await (await fetch(URL + "/listar/autos/disponibles", {
        method: "GET",
        headers: cabeceras
    })).json();
    console.log("eeeeeeeeeee", datos);
    return datos;
}

export const ObtenerVendidos = async (key) => {
    const cabeceras = {
        "news-token": key,
        "Accept": 'aplication/json',
        "Content-Type": 'application/json'
    };
    const datos = await (await fetch(URL + "/listar/autos/vendidos", {
        method: "GET",
        headers: cabeceras
    })).json();
    console.log("eeeeeeeeeee", datos);
    return datos;
}