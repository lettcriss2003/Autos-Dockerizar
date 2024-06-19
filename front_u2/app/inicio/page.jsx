'use client';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { InicioSesion } from '../componentes/hooks/Conexion';
import { saveToken, save } from '../componentes/hooks/SessionUtil';
import mensajes from '../componentes/Mensajes';
import { useRouter } from 'next/navigation';
export default function Page() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        var datos = {
            "usuario": data.usuario,
            "clave": data.clave
        };
        InicioSesion(datos).then((info) => {
            console.log('SessionFRM');
            console.log('lol ', info);
            if (info.code !== 200) {
                console.log('entro 2');
                mensajes("Error en inicio de sesion", info.msg, "error");
            } else {
                saveToken(info.info.token);
                save('id', info.info.id);
                save('user', info.info.user);
                mensajes("Has ingresado al sistema!", "Bienvenido usuario");
                if (info.info.id === 'GERENTE') {
                    router.push('/autos');
                    router.refresh();
                }else{
                    router.push('/autos');
                    router.refresh();
                }

            }
        });
    };

    return (
        <section className="text-center text-lg-start">
            <div className="container py-4" style={{ cascading: "margin-right: -50px", media: "max-width: 991.98px" }}>
                <div className="row g-0 align-items-center">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="card cascading-right">
                            <div className="card-body p-5 shadow-5 text-center">
                                <h2 className="fw-bold mb-5">Iniciar sesion</h2>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="divider d-flex align-items-center my-4">
                                        <p className="text-center fw-bold mx-3 mb-0">
                                        </p>
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input type="email" id="form3Example3" className="form-control form-control-lg"
                                            placeholder="Ingrese correo"  {...register('usuario', { required: true, pattern: /^\S+@\S+$/i })} />
                                        {errors.usuario && errors.usuario.type === 'required' && <div className='alert alert-danger'>Ingrese el correo</div>}
                                        {errors.usuario && errors.usuario.type === 'pattern' && <div className='alert alert-danger'>Ingrese un correo valido</div>}
                                        <label className="form-label" htmlFor="form3Example3">Correo</label>
                                    </div>


                                    <div className="form-outline mb-3">
                                        <input type="password" id="form3Example4" className="form-control form-control-lg"
                                            placeholder="Ingrese clave" {...register('clave', { required: true })} />
                                        {errors.clave && errors.clave.type === 'required' && <div className='alert alert-danger'>Ingrese una clave</div>}
                                        <label className="form-label" htmlFor="form3Example4">Clave</label>
                                    </div>

                                    <div className="text-center text-lg-start mt-4 pt-2">
                                        <button type="submit" className="btn btn-primary btn-lg"
                                            style={{ paddingLeft: 2.5, paddingRight: 2.5 }}>Iniciar sesion</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <img src="https://images.unsplash.com/photo-1603575283711-63ed37bc0ce6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhciUyMHBsYXRlfGVufDB8fDB8fHww&w=1000&q=80" className="w-100 rounded-4 shadow-4"
                            alt="" style={{ margin: "50px" }} />
                    </div>
                </div>
            </div>

        </section>
    );
}