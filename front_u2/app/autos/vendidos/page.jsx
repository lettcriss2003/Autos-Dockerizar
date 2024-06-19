'use client';
import React, { useState, useEffect } from 'react';
import { getToken } from '@/app/componentes/hooks/SessionUtilClient';
import { ObtenerVendidos } from '@/app/componentes/hooks/Conexion';
import Link from 'next/link';

export default function Autos() {

    const [autos, setAutos] = useState([]);

    useEffect(() => {
        const obtenerAutos = async () => { //metodo nuevo
            try {
                const token = getToken();
                console.log(token);
                const response = await ObtenerVendidos(token);
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
                <h1>LISTA DE AUTOS VENDIDOS</h1>
            </figure>
            <div className="container-fluid">
                <div className="col-4">
                    <Link href="/autos/vender" className="btn btn-success">VENDER AUTO</Link>
                </div>
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
                            <th>Dueño</th>
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
                                <td>{auto.duenio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};