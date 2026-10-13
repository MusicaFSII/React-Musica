import { useState, useEffect } from 'react'
import { BsArrowRightShort, BsArrowUpRight, BsDisc} from "react-icons/bs"
import { Link } from 'react-router-dom'
import './home.css'

const paletaColores = ['grunge', 'rock', 'alternative', 'indie', 'soul', 'glam'];

const formatoPrecio = (precio) =>
  precio.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  })

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try{
        const res = await fetch ('/api/productos')
        const data = await res.json()
        setProductos(data.productos || [])
      }
      catch (error){
        console.error("Error al conectar al servidor", error)
      }
    }
    cargarProductos()
  }, []);

  const categoriasunicas = Array.from(
  new Map(
    productos
      .filter(p => p.categoria_nombre) // Asegura que al menos tenga nombre
      .map(p => {
        const idReal = p.categoria_id || p.id_categoria || p.categoria_nombre;
        return [idReal, { id: idReal, nombre: p.categoria_nombre }];
      })
  ).values()
)

  return (
    <main className="offbeat-home">

      <section className="offbeat-hero">
        <div className="hero-photo" />

        <div className="hero-grain" />

        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span>INDEPENDENT VINYL STORE</span>
              <span>EST. 2026 — CHILE</span>
            </div>

            <h1>
              MÚSICA
              <br />
              EN FORMATO
              <br />
              <span>REAL.</span>
            </h1>

            <p>
              Discos para descubrir, coleccionar
              y escuchar una y otra vez.
            </p>

            <a href="#destacados" className="hero-cta">
              Explorar vinilos
              <BsArrowRightShort size={20} />
            </a>

            <span className="hero-bottom-label">
              VINYL · MUSIC · CULTURE
            </span>
          </div>
        </div>

        <div className="hero-sticker">
          <BsDisc size={27}/>
          <span>
            THE SOUND
            <br />
            OF SOMETHING
            <br />
            DIFFERENT.
          </span>
        </div>

        <div className="hero-side-label">
          OFFBEAT RECORDS / 33⅓ RPM
        </div>
      </section>


      <section className="offbeat-featured" id="destacados">
        <div className="featured-heading">
          <div>
            <span className="section-eyebrow">
              01 / DISCOS DESTACADOS
            </span>
            <h2>
              En rotación<span>.</span>
            </h2>
            <p>
              Grandes álbumes, buenas historias
              y música que merece una vuelta más.
            </p>
          </div>

          <Link to="/producto" className="section-link">
            Ver catálogo
            <BsArrowUpRight size={18} />
          </Link>
        </div>

        <div className="vinyl-grid">
          {productos.slice(0, 6).map((prod) => {
            const idUnico = prod.id_producto || prod.codigo

            return (
              <article className="vinyl-card" key={idUnico}>
                <Link to={`/producto/${prod.codigo}`} className="text-decoration-none text-dark">
                  <div className="vinyl-artwork">
                    <img
                      src={prod.imagen_url}
                      alt={`Portada de ${prod.nombre}`}
                      loading="lazy"
                    />

                    <span className="vinyl-genre">
                      {prod.categoria_nombre || 'VINILO'}
                    </span>
                  </div>

                  <div className="vinyl-details">
                    <div className="vinyl-description">
                      <h3>{prod.nombre}</h3>
                      <p>{prod.descripcion || 'Album en vinilo'}</p>
                      {prod.en_oferta === 1 && prod.porc_oferta > 0 ? (
                        <div>
                            <span>{formatoPrecio(prod.precio)}</span>
                            <strong>{formatoPrecio(prod.precio_final)}</strong>
                            <span>-{prod.porc_oferta}%</span>
                          </div>
                      ):(
                       <strong>{formatoPrecio(prod.precio_final)}</strong> 
                      )}
                      
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="offbeat-categories">
        <div className="categories-heading">
          <span className="section-eyebrow">
            02 / ENCUENTRA TU SONIDO
          </span>

          <h2>
            Cada disco tiene
            <br />
            su propia historia<span>.</span>
          </h2>
        </div>

        <div className="genre-grid">
          {categoriasunicas.map((cat, index) => {
            const numeroFormateado = String(index + 1).padStart(2, '0')

            const claseColor = paletaColores[index % paletaColores.length];
            
            return (
              <Link to={`/categorias/${cat.id}`} className={`genre-card ${claseColor}`} key={cat.id || `cat-${index}`}>
                <span className="genre-number">
                  {numeroFormateado} / OFFBEAT
                </span>

                <BsDisc className="genre-disc" />

                <div className="genre-bottom">
                  <h3>{cat.nombre}</h3>
                  <BsArrowUpRight size={25} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default Home