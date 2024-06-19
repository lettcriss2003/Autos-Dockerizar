'use client';
import React, { useState, useEffect } from 'react';
import { obtener } from '@/app/componentes/hooks/Conexion';
import Link from 'next/link';

export default function Page() {

    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const obtenerRol = async () => {
          try {
            const response = await obtener('/admin/rol');
            console.log("respmse", response);
            const resultado = response.datos;
            console.log("roleees",resultado);
      
            // Buscar el rol con nombre "usuario"
            const usuarioRol = resultado.find((roles) => roles.nombre === 'AGENTE');
            console.log("rooool",usuarioRol);
      
            if (usuarioRol) {
              // Si se encuentra el rol "usuario", realizar la solicitud para listar usuarios
              const responseUsuarios = await obtener(`/listarPorRol/${usuarioRol.external_id}`);
              const resultadoUsuarios = responseUsuarios.info;
              console.log("Usuarios con rol 'usuario':", resultadoUsuarios);
              setUsuarios(resultadoUsuarios);
            } else {
              console.log("Rol 'usuario' no encontrado");
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };
      
        obtenerRol();
      }, []);

    return (
        <div className="row">
            <figure className="text-center">
                <h1>LISTA DE AGENTES</h1>
            </figure>
            <div className="container-fluid">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nro</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Direccion</th>
                            <th>Identificacion</th>
                            <th>Correo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((agente, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{agente.apellidos}</td>
                                <td>{agente.nombres}</td>
                                <td>{agente.direccion}</td>
                                <td>{agente.identificacion}</td>
                                <td>{agente.cuenta.usuario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};