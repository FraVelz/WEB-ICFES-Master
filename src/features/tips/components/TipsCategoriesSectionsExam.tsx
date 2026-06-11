import { TipCard } from './TipCard';
import { TipsCategorySection } from './TipsCategorySection';

export function TipsCategoriesSectionsExam() {
  return (
    <>
      <TipsCategorySection
        id="preparacion"
        title="Preparación ICFES"
        description="Estrategias específicas para las pruebas Saber 11."
        icon="graduation-cap"
      >
        <TipCard
          title="Conoce el formato del examen"
          description={
            'Familiarízate con el número de preguntas, tiempos y áreas evaluadas. Los' +
            'simulacros de la app replican esa estructura.'
          }
        />
        <TipCard
          title="Domina el manejo del tiempo en el simulacro"
          description={
            'Practica con cronómetro. Si una pregunta te bloquea, márcala y sigue; ' +
            'vuelve al final si queda tiempo.'
          }
        />
        <TipCard
          title="Refuerza lectura crítica"
          description={
            'Muchas áreas dependen de comprender bien el enunciado. Lee con calma y' +
            'subraya datos clave antes de responder.'
          }
        />
        <TipCard
          title="Repasa fórmulas y conceptos base"
          description={
            'En matemáticas y ciencias naturales, ten a mano las fórmulas que más' +
            'aparecen y practícalas con contexto, no de memoria aislada.'
          }
        />
      </TipsCategorySection>

      <TipsCategorySection
        id="constancia"
        title="Motivación y constancia"
        description="Mantén el ritmo durante semanas y meses de preparación."
        icon="fire"
      >
        <TipCard
          title="Metas pequeñas y alcanzables"
          description={
            'En lugar de “sacar 400”, apunta a “completar 3 lecciones hoy” o “mantener la' +
            'racha 7 días”. Las metas pequeñas generan momentum.'
          }
        />
        <TipCard
          title="Celebra los avances"
          description={
            'Revisa tus logros y nivel en la app. Ver progreso concreto refuerza la' +
            'motivación más que compararte solo con el puntaje final.'
          }
        />
        <TipCard
          title="Estudia con alguien"
          description="Comparte metas con un compañero o familia. La clasificatoria también añade motivación social."
        />
        <TipCard
          title="Descansa bien"
          description={
            'Dormir 7–8 horas mejora memoria y concentración. Estudiar cansado es menos' +
            'eficiente que una sesión corta descansado.'
          }
        />
      </TipsCategorySection>

      <TipsCategorySection
        id="examen"
        title="El día del examen"
        description="Qué hacer antes, durante y después de presentar las pruebas."
        icon="clipboard-list"
      >
        <TipCard
          title="Prepara la logística con anticipación"
          description={
            'Revisa sede, horario, documentos y transporte el día anterior. ' +
            'Llegar con tiempo reduce el estrés.'
          }
        />
        <TipCard
          title="Prepárate para la jornada completa"
          description={
            'El ICFES son varias horas seguidas de concentración y resolución de' +
            'problemas. Entrenar tu resistencia mental y saber manejar el estrés es tan' +
            'importante como dominar los contenidos.'
          }
        />
        <TipCard
          title="Lleva un reloj analógico tradicional"
          description={
            'Si el reglamento lo permite, un reloj analógico te ayuda a controlar el' +
            'tiempo sin distracciones de pantallas. Practica con él en simulacros para' +
            'acostumbrarte a revisarlo sin perder el ritmo.'
          }
        />
        <TipCard
          title="Ritmo: unos 2 min 8 s por pregunta"
          description={
            'Como referencia, apunta a unos 2 minutos y 8 segundos por pregunta. No es' +
            'regla fija, pero te sirve para detectar si te estás quedando atrás o' +
            'adelantado en cada bloque.'
          }
        />
        <TipCard
          title="Organiza descansos y pausas"
          description={
            'Entre bloques o periodos, aprovecha los descansos autorizados: estírate,' +
            'respira, ve al baño con tiempo. Distribuye bien el tiempo para responder' +
            'cada pregunta sin apresurarte al final.'
          }
        />
        <TipCard
          title="Prepárate para el entorno, no solo el contenido"
          description={
            'A mayor ambición, mayor preparación: no basta con saber la materia. Simula' +
            'la duración, el silencio, las hojas de respuesta y la presión del día real' +
            'para llegar acostumbrado a la situación de evaluación.'
          }
        />
        <TipCard
          title="Desayuno ligero y agua"
          description={
            'Evita comidas pesadas. Lleva un snack permitido si lo autorizan. ' +
            'Mantente hidratado durante la jornada.'
          }
        />
        <TipCard
          title="Lee todas las opciones antes de marcar"
          description={
            'En preguntas de selección múltiple, descarta las opciones claramente' +
            'incorrectas y elige entre las que quedan.'
          }
        />
        <TipCard
          title="No te quedes atascado"
          description={
            'Si no sabes una respuesta, elige la más razonable y avanza. Es mejor' +
            'responder todo que dejar preguntas en blanco sin intentar.'
          }
        />
      </TipsCategorySection>
    </>
  );
}
