import { Inter } from 'next/font/google'
//import './globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import Menu from './componentes/menuAdmin';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AUTOS</title>
      </head>
      <body className={inter.className}>
        <div className='container' />
        <header>
          <Menu />
        </header>
        <section className='container-fluid'>
        {children}
        </section>    
      </body>
    </html>
  )
}