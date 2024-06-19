'use client';
import Link from "next/link";
import { borrarSesion, getRol } from "./hooks/SessionUtilClient";
import { estaSesion } from "./hooks/SessionUtil";
import mensajes from "./Mensajes";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();

  const salir = async () => {
    await borrarSesion();
    mensajes("GRACIAS!", "Hasta pronto");
    router.push('/inicio');
    router.refresh();
  }

  const rol = getRol();
  //console.log("rol", rol);

  const mostrarElementosMenu = estaSesion(); // Verifica si la sesión está iniciada
  //console.log(mostrarElementosMenu)

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid">
        <label className="navbar-brand">AGENCIA DE AUTOS</label>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {mostrarElementosMenu && (
              <>
                {rol === 'GERENTE' && (
                  <>
                    <li className="nav-item">
                      <Link href="/autos" className="nav-link active" aria-current="page">PRINCIPAL</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/nuevo" className="nav-link active" aria-current="page">NUEVO AUTO</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/nuevo/usuario" className="nav-link active" aria-current="page">AGREGAR USUARIO</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/listas/usuario" className="nav-link active" aria-current="page">CLIENTES</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/listas/agente" className="nav-link active" aria-current="page">AGENTES</Link>
                    </li>
                    <li className="nav-item">
                      <Link href={"/inicio"} onClick={salir} className="nav-link active" aria-current="page">CERRAR SESIÓN</Link>
                    </li>
                  </>
                )}
                {rol === 'USUARIO' && (
                  <>
                  <li className="nav-item">
                      <Link href="/autos" className="nav-link active" aria-current="page">PRINCIPAL</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/listas/agente" className="nav-link active" aria-current="page">AGENTES</Link>
                    </li>
                  <li className="nav-item">
                    <Link href={"/inicio"} onClick={salir} className="nav-link active" aria-current="page">CERRAR SESIÓN</Link>
                  </li>
                  </>
                )}
                {rol === 'AGENTE' && (
                  <>
                    <li className="nav-item">
                      <Link href="/autos" className="nav-link active" aria-current="page">PRINCIPAL</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/nuevo/cliente" className="nav-link active" aria-current="page">AGREGAR CLIENTE</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/listas/usuario" className="nav-link active" aria-current="page">CLIENTES</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/autos/vendidos" className="nav-link active" aria-current="page">VENDIDOS</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/ventas" className="nav-link active" aria-current="page">VENTAS</Link>
                    </li>
                    <li className="nav-item">
                      <Link href={"/inicio"} onClick={salir} className="nav-link active" aria-current="page">CERRAR SESIÓN</Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}