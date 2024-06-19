'use client';
import React, { useState, useEffect } from 'react';
import { getToken } from '../componentes/hooks/SessionUtilClient';
import { ObtenerAuto, url_api2 } from '../componentes/hooks/Conexion';
import Link from 'next/link';

export default function Autos() {

    const [autos, setAutos] = useState([]);

    useEffect(() => {
        const obtenerAutos = async () => { //metodo nuevo
            try {
                const token = getToken();
                console.log(token);
                const response = await ObtenerAuto(token);
                const resultado = response.info;
                setAutos(resultado);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        obtenerAutos();
    }, []);
    return (
        <div className="row">
            <figure className="text-center">
                <h1>LISTA DE AUTOS</h1>
            </figure>
            <div className="container-fluid">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nro</th>
                            <th>Foto</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Color</th>
                            <th>Costo</th>
                            <th>EDITAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autos.map((auto, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    {auto.foto === 'auto.png' ? (
                                        <>
                                            <Link href="/foto/[external]" as={`/foto/${auto.external_id}`} className="btn btn-outline-succes btn-rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-file-earmark-image" viewBox="0 0 16 16">
                                                    <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                                    <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z" />
                                                </svg>
                                            </Link>
                                        </>
                                    ) : (
                                        <img
                                            src={`http://localhost:3006/images/${auto.foto}`}
                                            alt="Foto del auto"
                                            style={{ width: '200px', height: 'auto' }}
                                        />
                                    )}
                                </td>
                                <td>{auto.marca.nombre}</td>
                                <td>{auto.marca.modelo}</td>
                                <td>{auto.anio}</td>
                                <td>{auto.color}</td>
                                <td>{auto.costo}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link href="/modficar/[external]" as={`/modficar/${auto.external_id}`} className="btn btn-outline-succes btn-rounded">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>

                                        </Link>
                                        <a href="/autos" className="btn btn-outline-danger btn-rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};
