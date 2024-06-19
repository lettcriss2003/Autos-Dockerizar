'use client';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { obtener, enviar} from '../componentes/hooks/Conexion';
import mensajes from '../componentes/Mensajes';
import { getToken } from '../componentes/hooks/SessionUtilClient';
import { useRouter } from 'next/navigation';

export default function Page() {
    const validationSchema = Yup.object().shape({
        anio: Yup.string().required('Ingrese el año'),
        placa: Yup.string().required('Ingrese la placa'),
        color: Yup.string().required('Ingrese el color'),
        costo: Yup.string().required('Ingrese costo sin IVA'),
        external_marca: Yup.string().required('Escoge una marca')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, watch, handleSubmit, formState } = useForm(formOptions);
    const router = useRouter();
    const { errors } = formState;
    const [marcas, setMarcas] = useState([]);

    useEffect(() => {
        const obtenerMarcas = async () => {
            try {
                const response = await obtener('/listar/marcas');
                const resultado = response.info;
                //console.log("aaaaaaaaaa", resultado);
                setMarcas(resultado)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        obtenerMarcas();
    }, []);
  
  //const { register, setValue, handleSubmit, formState: { errors } } = useForm();
  //const router = useRouter();

  //acciones
  // onsubmit
  const onSubmit = (data) => {
    var datos = {
      "anio": data.anio,
      "external_marca": data.external_marca,
      "costo": data.costo,
      "color": data.color,
      "placa": data.placa
    };
    enviar('/registrar/auto',datos, getToken()).then((info) => {
      console.log(datos);
      if (info.code === 400) {
        mensajes("Error en inicio de sesion", info.msg, "error");
        router.push('/nuevo');      
      } else {
        console.log("infoooo",info);
        mensajes("Buen trabajo!", "REGISTRADO CON ÉXITO");
        router.push('/autos');  
      }
    }
    );
  };

    return (
        <div className="container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '50px' }}>
          <h2 className="text-center">Registrar Auto</h2>
          <div className="wrapper">
            <div className="d-flex flex-column">
              <div className="content">
                <div className='container-fluid'>
                  <form className="user" style={{ marginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-outline mb-4">
                          <label className="form-label">Año</label>
                          <input {...register('anio')} name="anio" id="anio" className={`form-control ${errors.anio ? 'is-invalid' : ''}`} />
                          <div className='alert alert-danger invalid-feedback'>{errors.anio?.message}</div>
                        </div>
      
                        <div className="form-outline mb-4">
                          <label className="form-label">Placa</label>
                          <input {...register('placa')} name="placa" id="placa" className={`form-control ${errors.placa ? 'is-invalid' : ''}`} />
                          <div className='alert alert-danger invalid-feedback'>{errors.placa?.message}</div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-outline mb-4">
                          <label className="form-label">Color</label>
                          <input {...register('color')} name="color" id="color" className={`form-control ${errors.color ? 'is-invalid' : ''}`} />
                          <div className='alert alert-danger invalid-feedback'>{errors.color?.message}</div>
                        </div>
      
                        <div className="form-outline mb-4">
                          <label className="form-label">Costo</label>
                          <input {...register('costo')} name="costo" id="costo" className={`form-control ${errors.costo ? 'is-invalid' : ''}`} />
                          <div className='alert alert-danger invalid-feedback'>{errors.costo?.message}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-label">Marca</label>
                          <select className='form-control' {...register('external_marca', { required: true })} onChange={(e) => setValue('external_marca', e.target.value)}>
                            <option value="">Elija una marca</option>
                            {Array.isArray(marcas) && marcas.map((mar, i) => (
                              <option key={i} value={mar.external_id}>
                                {mar.nombre+' <-> '+mar.modelo}
                              </option>
                            ))}
                          </select>
                          {errors.marca && errors.marca.type === 'required' && <div className='alert alert-danger'>Seleccione una marca</div>}
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