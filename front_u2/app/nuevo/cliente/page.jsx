'use client';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { obtener, enviar } from '/app/componentes/hooks/Conexion';
import mensajes from '/app/componentes/Mensajes';
import { getToken } from '/app/componentes/hooks/SessionUtilClient';
import { useRouter } from 'next/navigation';

export default function Page() {
    const validationSchema = Yup.object().shape({
        identificacion: Yup.string().required('Ingrese nro de cedula/identificacion'),
        nombres: Yup.string().required('Ingrese sus nombres'),
        apellidos: Yup.string().required('Ingrese sus apellidos'),
        direccion: Yup.string().required('Ingrese la direccion'),
        correo: Yup.string().required('Ingrese un correo'),
        clave: Yup.string().required('Ingrese una clave')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, handleSubmit, formState } = useForm(formOptions);
    const router = useRouter();
    const { errors } = formState;

    //acciones
    // onsubmit
    const onSubmit = (data) => {
        var datos = {
            "identificacion": data.identificacion,
            "nombres": data.nombres,
            "apellidos": data.apellidos,
            "direccion": data.direccion,
            "external_rol": '59ef50c0-be28-4cbb-acb1-7fd33d467e4c',
            "correo": data.correo,
            "clave": data.clave
        };
        enviar('/registrar/persona', datos, getToken()).then((info) => {
            console.log(datos);
            if (info.code === 400) {
                mensajes("Error en inicio de sesion", info.msg, "error");
                router.push('/nuevo/cliente');
            } else {
                //console.log("infoooo", info);
                mensajes("Buen trabajo!", info.msg, "success");
                router.push('/listas/usuario');
            }
        }
        );
    };

    return (
        <div className="container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '50px' }}>
            <h2 className="text-center">Registrar Cliente</h2>
            <div className="wrapper">
                <div className="d-flex flex-column">
                    <div className="content">
                        <div className='container-fluid'>
                            <form className="user" style={{ marginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-outline mb-4">
                                            <label className="form-label">Identificacion</label>
                                            <input {...register('identificacion')} name="identificacion" id="identificacion" className={`form-control ${errors.identificacion ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.identificacion?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Nombres</label>
                                            <input {...register('nombres')} name="nombres" id="nombres" className={`form-control ${errors.nombres ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.nombres?.message}</div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-outline mb-4">
                                            <label className="form-label">Apellidos</label>
                                            <input {...register('apellidos')} name="apellidos" id="apellidos" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.apellidos?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Direccion</label>
                                            <input {...register('direccion')} name="direccion" id="direccion" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.direccion?.message}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-outline mb-4">
                                            <label className="form-label" >Correo electrónico</label>
                                            <input {...register('correo', { required: true, pattern: /^\S+@\S+$/i })} name="correo" id="correo" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.correo?.message}</div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-outline mb-4">
                                            <label className="form-label" >Clave</label>
                                            <input {...register('clave')} type='password' name="clave" id="clave" className={`form-control ${errors.clave ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.clave?.message}</div>
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
                                            <input className="btn btn-success btn-rounded" type='submit' value='Registrar'></input>
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
}