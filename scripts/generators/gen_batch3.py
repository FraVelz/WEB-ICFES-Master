import os

OUTPUT_DIR = "/home/fravelz/Documentos/WEB-ICFES-Master/scripts/markdown"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def write_lesson(filename, content):
    with open(os.path.join(OUTPUT_DIR, filename), "w", encoding="utf-8") as f:
        f.write(content)

lessons_ingles = [
    {
        "id": "ingles_present_simple",
        "title": "Present Simple",
        "order": 1,
        "content": """# Present Simple (ICFES)

## ¿Qué evalúa el ICFES aquí?
Rutinas, hechos y verdades generales. La famosa "S" en tercera persona.

## Conceptos clave (lo que sí o sí debo saber)
- **Uso:** Rutinas (I wake up), Hechos (The sun rises).
- **Regla de Oro:** Con He, She, It -> Agrega **S** al verbo. (She play**s**, He eat**s**).
- **Auxiliares:** Do (I, You, We, They) / Does (He, She, It) para preguntas y negaciones.

## Cómo suele preguntar el ICFES
- Textos sobre la vida diaria de alguien.
- Completar espacios: "She _____ (work) in a bank."

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Complete: "My brother _____ soccer every Sunday."
A) play
B) playing
C) plays
D) played

**Análisis:**
- "My brother" es "He" (Él).
- "Every Sunday" indica rutina (Presente Simple).
- Regla: He + Verbo + S.
- **Respuesta:** C) plays.

## Resumen para memorizar
- He/She/It = S (Super S).
- Rutinas = Presente Simple."""
    },
    {
        "id": "ingles_past_simple",
        "title": "Past Simple",
        "order": 2,
        "content": """# Past Simple (ICFES)

## ¿Qué evalúa el ICFES aquí?
Historias terminadas. Diferenciar verbos regulares e irregulares.

## Conceptos clave (lo que sí o sí debo saber)
- **Regulares:** Terminan en -ED (Walk -> Walked).
- **Irregulares:** Cambian totalmente (Go -> Went, Eat -> Ate). ¡Apréndete los top 20!
- **Auxiliar:** DID para todos en preguntas y negaciones. (Did you go? I didn't go).

## Cómo suele preguntar el ICFES
- Biografías de personajes famosos.
- "Yesterday", "Last year", "In 1990".

## Ejemplo tipo ICFES (explicado)
**Enunciado:** "Shakespeare _____ Romeo and Juliet in 1597."
A) write
B) wrote
C) written
D) writing

**Análisis:**
- 1597 ya pasó. Necesitamos pasado.
- Write es irregular. Pasado = Wrote.
- **Respuesta:** B) wrote.

## Resumen para memorizar
- Si ves "Yesterday" o una fecha vieja -> Pasado.
- Si usas DID, el verbo vuelve a normal (Did she play? NO Did she played?)."""
    },
    {
        "id": "ingles_future",
        "title": "Future (Will vs Going to)",
        "order": 3,
        "content": """# Future: Will vs Going to (ICFES)

## ¿Qué evalúa el ICFES aquí?
Predicciones vs Planes.

## Conceptos clave (lo que sí o sí debo saber)
- **Will:** Futuro incierto, promesas o decisiones al instante. ("I think it will rain").
- **Going to:** Planes seguros, evidencia visual. ("Look at those clouds! It is going to rain").

## Cómo suele preguntar el ICFES
- Conversaciones sobre planes de vacaciones.
- Horóscopos o predicciones tecnológicas.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** "I bought the tickets. I _____ travel to Paris next week."
A) will
B) am going to
C) go
D) went

**Análisis:**
- Ya compró los tiquetes. Es un plan seguro.
- **Respuesta:** B) am going to.

## Resumen para memorizar
- Plan seguro = Going to.
- "I think", "Maybe", "Probably" = Will."""
    },
    {
        "id": "ingles_comparatives",
        "title": "Comparatives and Superlatives",
        "order": 4,
        "content": """# Comparatives and Superlatives (ICFES)

## ¿Qué evalúa el ICFES aquí?
Comparar cosas. "Más grande que" o "El más grande".

## Conceptos clave (lo que sí o sí debo saber)
- **Cortos (1 sílaba):**
    - Comparativo: +ER (Tall -> Taller).
    - Superlativo: THE +EST (Tall -> The Tallest).
- **Largos (2+ sílabas):**
    - Comparativo: MORE (Expensive -> More expensive).
    - Superlativo: THE MOST (Expensive -> The most expensive).
- **Irregulares:** Good -> Better -> Best. Bad -> Worse -> Worst.

## Cómo suele preguntar el ICFES
- Comparar productos o ciudades.
- "The Nile is the _____ river in the world."

## Ejemplo tipo ICFES (explicado)
**Enunciado:** "This car is _____ than that one."
A) fast
B) faster
C) fastest
D) more fast

**Análisis:**
- Hay un "THAN" (que). Es comparación.
- Fast es corto. Se usa -ER.
- **Respuesta:** B) faster.

## Resumen para memorizar
- THAN = Comparativo (ER / More).
- THE = Superlativo (EST / Most).
- Nunca digas "More fast" (Error típico)."""
    },
    {
        "id": "ingles_modals",
        "title": "Modal Verbs (Can, Must, Should)",
        "order": 5,
        "content": """# Modal Verbs (ICFES)

## ¿Qué evalúa el ICFES aquí?
Reglas, consejos y habilidades. Señales de tránsito.

## Conceptos clave (lo que sí o sí debo saber)
- **Can:** Habilidad (I can swim) o Permiso informal.
- **Must:** Obligación fuerte / Ley (You must wear a seatbelt).
- **Should:** Consejo (You should study more).
- **Have to:** Obligación externa (I have to work).

## Cómo suele preguntar el ICFES
- Avisos en lugares públicos (Parte 1 del examen).
- "You _____ smoke in the hospital." (Must not).

## Ejemplo tipo ICFES (explicado)
**Aviso:** "Do not feed the animals." (Zoológico).
**Pregunta:** What does the notice say?
A) You can give food to animals.
B) You must not give food to animals.
C) You should eat with animals.

**Análisis:**
- Es una prohibición. Must not = Prohibido.
- **Respuesta:** B.

## Resumen para memorizar
- Must = Obligación (!).
- Should = Consejo (?).
- Can = Poder."""
    },
    {
        "id": "ingles_reading_main",
        "title": "Reading: Main Idea",
        "order": 6,
        "content": """# Reading: Main Idea (ICFES)

## ¿Qué evalúa el ICFES aquí?
Entender de qué trata el texto globalmente, no los detalles.

## Conceptos clave (lo que sí o sí debo saber)
- **Skimming:** Leer rápido solo títulos, primera y última frase de cada párrafo para pillar la idea general.
- No te pegues de palabras que no conoces. Sigue leyendo.

## Cómo suele preguntar el ICFES
- "What is the text about?"
- "What is the best title for the article?"

## Ejemplo tipo ICFES (explicado)
**Texto:** Habla sobre cómo las abejas polinizan, hacen miel y viven en colmenas.
**Pregunta:** What is the main topic?
A) How to make honey.
B) The life of bees.
C) Flowers in the garden.

**Análisis:**
- A es solo una parte. C es contexto.
- **Respuesta:** B) Cubre todo el texto.

## Resumen para memorizar
- El título suele ser la respuesta.
- Busca la opción más general que abarque todo."""
    },
    {
        "id": "ingles_reading_specific",
        "title": "Reading: Specific Information",
        "order": 7,
        "content": """# Reading: Specific Information (ICFES)

## ¿Qué evalúa el ICFES aquí?
Scanning. Buscar un dato exacto (fecha, nombre, lugar).

## Conceptos clave (lo que sí o sí debo saber)
- **Scanning:** Buscar palabras clave de la pregunta en el texto como un robot.
- No leas todo. Busca la "keyword".

## Cómo suele preguntar el ICFES
- "Where did she go in 1999?"
- "How many apples did he buy?"

## Ejemplo tipo ICFES (explicado)
**Texto:** "...Einstein was born in Germany in 1879..."
**Pregunta:** Where was Einstein born?
A) USA
B) Germany
C) 1879

**Análisis:**
- Pregunta WHERE (Dónde). Busca lugares.
- Texto dice Germany.
- **Respuesta:** B.

## Resumen para memorizar
- Who = Persona.
- Where = Lugar.
- When = Tiempo.
- Why = Razón (Busca "Because")."""
    },
    {
        "id": "ingles_vocabulary",
        "title": "Vocabulary in Context",
        "order": 8,
        "content": """# Vocabulary in Context (ICFES)

## ¿Qué evalúa el ICFES aquí?
Parte 2 del examen (Cloze). Rellenar huecos con la palabra precisa.

## Conceptos clave (lo que sí o sí debo saber)
- **Collocations:** Palabras que van juntas. (Make a mistake, Do homework).
- **Preposiciones:** Good AT, Interested IN, Afraid OF.

## Cómo suele preguntar el ICFES
- Textos con espacios en blanco.
- "She is interested _____ art." (in/on/at).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** "I usually _____ breakfast at 7 AM."
A) do
B) make
C) have
D) take

**Análisis:**
- En inglés se dice "Have breakfast" (Desayunar). No se suele usar "Make" o "Do" para la acción de comerlo rutinariamente.
- **Respuesta:** C) have.

## Resumen para memorizar
- Apréndete los verbos con sus parejas (Listen TO, Look AT).
- Have breakfast/lunch/dinner."""
    },
    {
        "id": "ingles_connectors",
        "title": "Connectors (Because, Although, However)",
        "order": 9,
        "content": """# Connectors (ICFES)

## ¿Qué evalúa el ICFES aquí?
Unir ideas lógicamente. Causa, efecto y contraste.

## Conceptos clave (lo que sí o sí debo saber)
- **And:** Suma (y).
- **But / However:** Contraste (pero / sin embargo).
- **Because:** Causa (porque).
- **So:** Consecuencia (así que / por lo tanto).
- **Although:** Concesión (aunque).

## Cómo suele preguntar el ICFES
- "He was sick, _____ he went to work." (But/So/Because).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** "It was raining, _____ we played soccer."
A) because
B) so
C) although
D) but

**Análisis:**
- Lluvia vs Jugar fútbol. Es una contradicción.
- Podría ser "But" (pero jugamos) o "Although" (Aunque llovía, jugamos).
- Estructuralmente: "Although it was raining, we played" o "It was raining, but we played".
- Si el espacio está al inicio: Although. Si está en medio: But.
- **Respuesta:** D) but (si está en medio).

## Resumen para memorizar
- Because explica por qué.
- So explica el resultado.
- But lleva la contraria."""
    },
    {
        "id": "ingles_daily",
        "title": "Daily Expressions (Conversations)",
        "order": 10,
        "content": """# Daily Expressions (ICFES)

## ¿Qué evalúa el ICFES aquí?
Parte 3 del examen. Completar conversaciones cortas. Pragmática.

## Conceptos clave (lo que sí o sí debo saber)
- Saludos y despedidas.
- Reacciones lógicas.
- Cortesía.

## Cómo suele preguntar el ICFES
- A: "I have a headache." -> B: ?
- A: "Can I open the window?" -> B: ?

## Ejemplo tipo ICFES (explicado)
**Persona A:** "I failed my exam."
**Persona B:**
A) Congratulations!
B) That's too bad.
C) You are welcome.

**Análisis:**
- A: Felicitar (Mal, reprobó).
- B: "Qué mal" (Empatía). **Correcta.**
- C: De nada (Sin sentido).

## Resumen para memorizar
- Lee la situación. ¿Es algo bueno o malo?
- Bueno -> Great! / Congratulations!
- Malo -> I'm sorry / That's a pity.
- Petición -> Sure / Of course."""
    }
]

for lesson in lessons_ingles:
    md_content = f"---\nid: {lesson['id']}\narea: ingles\norder: {lesson['order']}\ntype: lesson\n---\n\n{lesson['content']}"
    write_lesson(f"{lesson['id']}.md", md_content)

print("Batch 3 (Inglés) generado exitosamente.")
