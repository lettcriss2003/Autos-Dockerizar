'use client';
import React, { useState, useEffect } from 'react';
import { getToken } from '../componentes/hooks/SessionUtilClient';
import { obtener } from '../componentes/hooks/Conexion';
import Link from 'next/link';

export default function Page() {
    const [autos, setAutos] = useState([]);
    // Estado para almacenar el mes seleccionado
    const [mesSeleccionado, setMesSeleccionado] = useState('');
    // Estado para almacenar la identificación ingresada
    const [identificacion, setIdentificacion] = useState('');

    useEffect(() => {
        const obtenerAutos = async () => {
            try {
                const token = getToken();
                console.log(token);
                const response = await obtener('/listar/facturas', token);
                const resultado = response.info;
                setAutos(resultado);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        obtenerAutos();
    }, []);

    // Función para formatear la fecha al formato dd/mm/aaaa
    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const dia = fechaObj.getDate();
        const mes = fechaObj.getMonth() + 1;
        const año = fechaObj.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // filtrar las facturas por mes e identificación
    const filtrarVentas = (auto) => {
        const mesValido = !mesSeleccionado || new Date(auto.fecha_emision).getMonth() + 1 === parseInt(mesSeleccionado);
        const identificacionValida = !identificacion || auto.persona.identificacion.includes(identificacion);
        return mesValido && identificacionValida;
    };

    // Filtrar las facturas según el mes seleccionado y la identificación ingresada
    const autosFiltrados = autos.filter(filtrarVentas);

    // Renderización del componente
    return (
        <div className="row">
            <figure className="text-center">
                <h1>LISTA DE VENTAS</h1>
            </figure>
            <div className="container-fluid" style={{ marginTop: '75px' }}>
                {/* Usar las clases de grilla de Bootstrap para colocar los elementos uno junto al otro */}
                <div className="row">
                    <div className="col-lg-2 mb-3">
                    <label htmlFor="mesSelect" className="form-label">Búsqueda por mes</label>
                        {/* Combo personalizado para seleccionar el mes */}
                        <select
                            className="form-select form-select"
                            aria-label="Selecciona un mes"
                            onChange={(e) => setMesSeleccionado(e.target.value)}
                            value={mesSeleccionado}
                        >
                            <option value="">Todos los meses</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                                <option key={mes} value={mes}>
                                    {mes}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-4 mb-3">
                    <label htmlFor="mesSelect" className="form-label">Búsqueda por identificacion</label>
                        {/* Campo de búsqueda por identificación */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por Identificación"
                            onChange={(e) => setIdentificacion(e.target.value)}
                            value={identificacion}
                        />
                    </div>
                </div>
                <table className="table table-hover" style={{ marginTop: '75px' }}>
                    <thead>
                        <tr>
                            <th>Nro</th>
                            <th>Fecha de emisión</th>
                            <th>Nro factura</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Recargo</th>
                            <th>Total</th>
                            <th>Cliente</th>
                            <th>Identificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autosFiltrados.map((auto, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{formatearFecha(auto.fecha_emision)}</td>
                                <td>{auto.numero_factura}</td>
                                <td>{auto.sub_total}</td>
                                <td>{auto.iva}</td>
                                <td>{auto.recargo}</td>
                                <td>{auto.total_pagar}</td>
                                <td>{auto.persona.nombres}</td>
                                <td>{auto.persona.identificacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
