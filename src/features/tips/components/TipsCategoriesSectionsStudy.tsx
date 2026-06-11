import { TipCard } from './TipCard';
import { TipsCategorySection } from './TipsCategorySection';

export function TipsCategoriesSectionsStudy() {
  return (
    <>
      <TipsCategorySection
        id="tiempo"
        title="Gestión del tiempo"
        description="Organiza tu estudio sin agobiarte ni dejar todo para el final."
        icon="clock"
      >
        <TipCard
          title="Bloques de 25–45 minutos"
          description={
            'Estudia en sesiones cortas con descansos de 5–10 minutos. Es más sostenible' +
            'que maratones de horas y mejora la retención.'
          }
        />
        <TipCard
          title="Prioriza por área débil"
          description={
            'Dedica más tiempo a las materias donde obtienes menos aciertos. Revisa tus' +
            'estadísticas en ICFES Master para identificarlas.'
          }
        />
        <TipCard
          title="Horario fijo diario"
          description={
            'Elige un momento del día (mañana, tarde o noche) y respétalo como una cita.' +
            'La constancia importa más que la cantidad de horas.'
          }
        />
        <TipCard
          title="Plan semanal realista"
          description={
            'Distribuye simulacros, práctica por área y repaso. Deja al menos un día de' +
            'descanso activo para evitar el agotamiento.'
          }
        />
      </TipsCategorySection>

      <TipsCategorySection
        id="concentracion"
        title="Concentración y enfoque"
        description="Recupera la calma y la atención cuando te sientes alterado o sin ganas de estudiar."
        icon="brain"
      >
        <TipCard
          title="Desintoxicación mental de 10 minutos"
          description={
            'Si estás alterado, ansioso o sin ganas de estudiar, siéntate al menos 10 minutos sin hacer nada: medita,' +
            'mira un punto fijo o respira en silencio. No revises el celular ni pienses en pendientes. Al terminar,' +
            'empieza con una tarea corta; la mente llegará más limpia y concentrada.'
          }
        />
      </TipsCategorySection>

      <TipsCategorySection
        id="estudio"
        title="Métodos de estudio"
        description="Técnicas probadas para aprender más en menos tiempo."
        icon="book-open"
      >
        <TipCard
          title="Practica activa, no solo lectura"
          description={
            'Resuelve preguntas en lugar de releer apuntes. La práctica con' +
            'retroalimentación es lo que más sube tu puntaje.'
          }
        />
        <TipCard
          title="Aprende de los errores"
          description={
            'Lee siempre la explicación de las preguntas incorrectas. ' + 'Anota el patrón del error para no repetirlo.'
          }
        />
        <TipCard
          title="Resume con tus palabras"
          description={
            'Después de una lección, explica el concepto en voz alta o por escrito. ' +
            'Si no puedes explicarlo, repasa.'
          }
        />
        <TipCard
          title="Alterna tipos de ejercicio"
          description={
            'Combina lecciones del roadmap, práctica por área y simulacros completos. La' +
            'variedad mantiene el cerebro activo.'
          }
        />
      </TipsCategorySection>
    </>
  );
}
