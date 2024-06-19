'use client';
import React, { useState, useEffect } from 'react';
import { obtener, enviar } from '@/app/componentes/hooks/Conexion';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import mensajes from '@/app/componentes/Mensajes';
import { getToken } from '@/app/componentes/hooks/SessionUtilClient';
import { useRouter } from 'next/navigation';


export default function Page() {

        const validationSchema = Yup.object().shape({
            external_persona: Yup.string().required('Escoge una marca')
        });
    
        const formOptions = { resolver: yupResolver(validationSchema) };
        const { register, setValue, watch, handleSubmit, formState } = useForm(formOptions);
        const router = useRouter();
        const { errors } = formState;
        const [usuarios, setUsuarios] = useState([]);
    
        useEffect(() => {
            const obtenerRol = async () => {
              try {
                const response = await obtener('/admin/rol');
                console.log("respmse", response);
                const resultado = response.datos;
                console.log("roleees",resultado);
          
                // Buscar el rol con nombre "usuario"
                const usuarioRol = resultado.find((roles) => roles.nombre === 'USUARIO');
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
      
      //const { register, setValue, handleSubmit, formState: { errors } } = useForm();
      //const router = useRouter();
    
      //acciones
      // onsubmit
      const onSubmit = (data) => {
        var datos = {
          "external_persona": data.external_persona,
        };
        enviar('/crear/factura',datos, getToken()).then((info) => {
          console.log(datos);
          if (info.code === 400) {
            mensajes("Error en inicio de sesion", info.msg, "error");
            router.push('/autos/vender');      
          } else {
            console.log("infoooo",info);
            mensajes("Buen trabajo!", "CREADO CON ÉXITO");
            router.push('/listas/factura');  
          }
        }
        );
      };

    return (
        <div className="container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '50px' }}>
        <h2 className="text-center">SELECCIONAR COMPRADOR</h2>
        <div className="wrapper">
          <div className="d-flex flex-column">
            <div className="content">
              <div className='container-fluid'>
                <form className="user" style={{ marginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-label">Lista de clientes</label>
                        <select className='form-control' {...register('external_persona', { required: true })} onChange={(e) => setValue('external_persona', e.target.value)}>
                          <option value="">Elija una persona</option>
                          {Array.isArray(usuarios) && usuarios.map((mar, i) => (
                            <option key={i} value={mar.external_id}>
                              {mar.apellidos+' '+mar.nombres}
                            </option>
                          ))}
                        </select>
                        {errors.marca && errors.marca.type === 'required' && <div className='alert alert-danger'>Seleccione una persona</div>}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <a href="/autos" className="btn btn-danger btn-rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                          </svg>
                          <span style={{ marginLeft: '5px' }}>Cancelar</span>
                        </a>
                        <input className="btn btn-success btn-rounded" type='submit' value='Crear factura'></input>
                      </div>
                    </div>
                  </div>
                </form>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};