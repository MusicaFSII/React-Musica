import { BsArrowDownShort, BsArrowUpShort, BsDisc, BsMusicNote  } from "react-icons/bs";
import { Link } from 'react-router-dom'
import './nosotros.css'

const historias = [
  {
    numero: '01',
    etiqueta: 'NUESTRA HISTORIA',
    titulo: 'Todo comienza con una canción.',
    descripcion:
      'Offbeat nace de una idea sencilla: la música merece algo más que sonar de fondo. Creemos en las canciones que nos acompañan, los álbumes que cuentan historias y esos discos que queremos escuchar una y otra vez.',
    imagen: '/images/nosotros-historia.jpg',
    alt: 'Interior de una tienda de discos de vinilo'
  },
  {
    numero: '02',
    etiqueta: 'NUESTRA PASIÓN',
    titulo: 'El encanto de lo analógico.',
    descripcion:
      'Sacar un disco de su funda, observar su portada y colocar la aguja sobre el vinilo. Para nosotros, escuchar música también es un ritual. Uno que invita a detenerse, descubrir detalles y disfrutar cada canción.',
    imagen: '/images/nosotros-vinilo.jpg',
    alt: 'Tocadiscos reproduciendo un vinilo'
  },
  {
    numero: '03',
    etiqueta: 'NUESTRA IDENTIDAD',
    titulo: 'Un ritmo diferente.',
    descripcion:
      'Nos gustan los clásicos, las rarezas y los descubrimientos inesperados. Offbeat es un espacio para quienes encuentran algo especial en la música y saben que una buena colección nunca está realmente terminada.',
    imagen: '/images/nosotros-cultura.jpg',
    alt: 'Colección de discos de vinilo'
  }
]

function Nosotros() {
  return (
    <main className="nosotros">

      <section className="nosotros-intro">
        <div className="nosotros-intro-top">
          <span>OFFBEAT RECORDS / ABOUT US</span>
          <span>VINYL · MUSIC · CULTURE</span>
        </div>

        <div className="nosotros-intro-content">
          <span className="nosotros-eyebrow">
            THE STORY BEHIND THE SOUND
          </span>

          <h1>
            NO SEGUIMOS
            <br />
            EL MISMO <em>RITMO.</em>
          </h1>

          <p>
            Somos una tienda de vinilos para quienes
            sienten la música de una manera diferente.
            Aquí cada disco tiene una historia que contar.
          </p>

          <a href="#nuestra-historia" className="nosotros-scroll">
            Conoce nuestra historia
            <BsArrowDownShort size={18} />
          </a>
        </div>

        <div className="nosotros-intro-bottom">
          <span>33⅓ RPM — CHILE</span>
          <BsDisc size={30}/>
        </div>
      </section>

      <section className="nosotros-video-section">
        <div className="nosotros-section-heading">
          <span className="nosotros-eyebrow">
            00 / PRESS PLAY
          </span>

          <h2>
            Siente el <span>sonido.</span>
          </h2>
        </div>

        <div className="nosotros-video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/_TB_wvYFox4"
            title="Offbeat Records - Siente el sonido"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <p className="nosotros-video-caption">
          THE SOUND OF SOMETHING DIFFERENT.
        </p>
      </section>

      <section className="nosotros-story" id="nuestra-historia">
        <div className="nosotros-story-heading">
          <span className="nosotros-eyebrow">
            BEHIND THE RECORDS
          </span>

          <h2>
            Nuestra historia<span>.</span>
          </h2>

          <p>
            Tres cosas que definen nuestra manera
            de vivir la música.
          </p>
        </div>

        <div className="nosotros-story-list">
          {historias.map((historia, index) => (
            <article
              className={`nosotros-story-card ${
                index % 2 !== 0 ? 'reverse' : ''
              }`}
              key={historia.numero}
            >
              <div className="nosotros-story-text">
                <span className="nosotros-story-number">
                  {historia.numero} / {historia.etiqueta}
                </span>

                <h3>{historia.titulo}</h3>

                <p>{historia.descripcion}</p>

                <div className="nosotros-story-decoration">
                  <BsDisc size={23}/>
                  <span>OFFBEAT RECORDS</span>
                </div>
              </div>

              <div className="nosotros-story-image">
                <img
                  src={historia.imagen}
                  alt={historia.alt}
                  loading="lazy"
                />

                <span className="nosotros-image-number">
                  SIDE {historia.numero}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="nosotros-final">
        <div className="nosotros-final-top">
          <BsMusicNote size={25} />
          <span>OUR PHILOSOPHY</span>
        </div>

        <h2>
          LA BUENA MÚSICA
          <br />
          NO PASA DE <span>MODA.</span>
        </h2>

        <p>
          Descubre discos que merecen un lugar
          en tu colección.
        </p>

        <Link to="/producto" className="nosotros-final-button">
          Explorar la tienda
          <BsArrowUpShort size={19} />
        </Link>
      </section>
    </main>
  )
}

export default Nosotros
