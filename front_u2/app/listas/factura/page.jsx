'use client';
import React, { useState, useEffect } from 'react';
import { getToken } from '@/app/componentes/hooks/SessionUtilClient';
import { obtener } from '@/app/componentes/hooks/Conexion';
import Link from 'next/link';

export default function Page() {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        const obtenerFacturas = async () => {
            try {
                let token = getToken();
                const response = await obtener('/listar/facturas', token);
                console.log("response", response);
                const resultado = response.info;
                console.log("facturas", resultado);

                // Buscar facturas con total a pagar igual a 0.00
                const facturasConTotalCero = resultado.filter((factura) => parseFloat(factura.total_pagar) === 0.00);
                console.log("facturasConTotalCero", facturasConTotalCero);

                if (facturasConTotalCero.length > 0) {
                    setFacturas(facturasConTotalCero);
                } else {
                    console.log("No se encontraron facturas con total a pagar igual a 0.00");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        obtenerFacturas();
    }, []);

    console.log("Facturas:", facturas);

    return (
        <div className="row">
            <figure className="text-center">
                <h1>FACTURAS EN BLANCO</h1>
            </figure>
            <div className="container-fluid" style={{marginTop: '50px'}}>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Direccion</th>
                            <th>Agregar detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura, index) => (
                            <tr key={index}>
                                <td>{factura.persona?.apellidos || '000'}</td>
                                <td>{factura.persona?.nombres || '000'}</td>
                                <td>{factura.persona?.direccion || '000'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link href={`/detalle/${factura.external_id || '000'}`} className="btn btn-outline-success btn-rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                                                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                            </svg>
                                        </Link>
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