import { ImportanciaContentSection } from './ImportanciaContentSection';

export function ImportanciaGeneralSections() {
  return (
    <>
      <ImportanciaContentSection id="brecha" title="La brecha salarial y de oportunidades" icon="chart-line">
        <p className="text-on-surface-muted leading-relaxed">
          En Colombia la diferencia entre no tener bachiller, tenerlo o sumar estudios superiores se nota en ingresos,
          estabilidad y tipo de trabajo. Son cifras aproximadas y varían por ciudad, sector y experiencia, pero ilustran
          la tendencia:
        </p>
        <ul className="text-on-surface-muted list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            Sin bachiller, muchas personas dependen del trabajo informal o de oficios sin contrato. Es común que los
            ingresos queden alrededor de 1 millón de pesos mensuales o menos, con poca estabilidad y difícil acceso a
            crédito o beneficios.
          </li>
          <li>
            Con bachiller acreditado, suele ser más fácil acceder a empleos formales —auxiliares, operarios calificados,
            atención al cliente, logística u oficios que piden diploma— con contrato, aportes y{' '}
            <strong className="text-on-surface font-semibold">más estabilidad en el ingreso</strong>.
          </li>
          <li>
            Con un buen puntaje y acceso a la universidad (o tecnología),{' '}
            <strong className="text-on-surface font-semibold">
              se abren carreras con mejores perspectivas de crecimiento
            </strong>
            . Un recién graduado con título puede empezar en roles junior formales, a menudo desde unos 2 salarios
            mínimos, y con experiencia en sectores demandantes escalar hacia ingresos de 10 millones de pesos mensuales
            o más en posiciones altamente cualificadas.
          </li>
        </ul>
      </ImportanciaContentSection>

      <ImportanciaContentSection id="cambio" title="Un cambio de vida para muchas familias" icon="heart">
        <p className="text-on-surface-muted leading-relaxed">
          Para quienes crecieron con limitaciones económicas o interrumpieron estudios, cerrar el bachiller y mejorar el
          puntaje puede significar{' '}
          <strong className="text-on-surface font-semibold">
            dejar un empleo precario, mudarse a una ciudad con más oferta o pagar los estudios de los hijos
          </strong>
          , además de acceder a vivienda y salud de forma más estable.
        </p>
        <p className="text-on-surface-muted leading-relaxed">
          No es magia ni ocurre de un día para otro: exige estudio, constancia y, a veces, combinar trabajo con
          preparación. Pero el salto entre informalidad, empleo formal y carrera profesional es{' '}
          <strong className="text-on-surface font-semibold">
            uno de los cambios más profundos que la educación puede generar en una familia
          </strong>
          .
        </p>
      </ImportanciaContentSection>

      <ImportanciaContentSection id="emprendimiento" title="Emprender y especializarse" icon="rocket">
        <p className="text-on-surface-muted leading-relaxed">
          La educación no solo sirve para ser empleado. Si quieres montar un negocio propio, estudiar temas relacionados
          con lo que harás —contabilidad básica, marketing, diseño, programación, gastronomía, construcción, salud— te
          da herramientas para emprender en nichos técnicos o especializados con{' '}
          <strong className="text-on-surface font-semibold">menos improvisación y más respaldo</strong>.
        </p>
        <p className="text-on-surface-muted leading-relaxed">
          El bachiller y la formación posterior te ayudan a entender normas, costos, calidad y a comunicarte con
          clientes, proveedores o inversionistas con más solidez.
        </p>
      </ImportanciaContentSection>

      <ImportanciaContentSection id="arte" title="Arte, talento y otros caminos" icon="magic">
        <p className="text-on-surface-muted leading-relaxed">
          Si te interesan el arte, la música, el deporte o cualquier área creativa, el estudio formal no reemplaza el
          talento, pero sí suma: mejor técnica, reconocimiento, redes de contacto, becas, portafolios más sólidos y
          opciones de enseñar o trabajar en proyectos culturales con respaldo académico.
        </p>
        <p className="text-on-surface-muted leading-relaxed">
          Muchas carreras artísticas y técnicas exigen bachiller para ingresar;{' '}
          <strong className="text-on-surface font-semibold">
            un buen puntaje puede abrir programas, convenios e instituciones
          </strong>{' '}
          que, sin ese requisito, quedarían fuera de tu alcance.
        </p>
      </ImportanciaContentSection>
    </>
  );
}
