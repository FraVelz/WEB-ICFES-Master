import os

OUTPUT_DIR = "/home/fravelz/Documentos/WEB-ICFES-Master/scripts/markdown"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def write_lesson(filename, content):
    with open(os.path.join(OUTPUT_DIR, filename), "w", encoding="utf-8") as f:
        f.write(content)

lessons_lectura = [
    {
        "id": "lectura_idea_principal",
        "title": "Idea principal y propósito del texto",
        "order": 1,
        "content": """# Idea principal y propósito del texto (ICFES)

## ¿Qué evalúa el ICFES aquí?
Evalúa tu capacidad para identificar la columna vertebral del texto. No se trata de detalles aislados, sino de entender de qué habla todo el escrito y para qué fue escrito.

## Conceptos clave (lo que sí o sí debo saber)
- **Idea Principal:** Es la oración o premisa que resume todo el texto. Si la quitas, el texto pierde sentido.
- **Tema:** Es el asunto general (ej: "el cambio climático"). La idea principal es lo que se dice sobre ese tema (ej: "el cambio climático es acelerado por la industria").
- **Propósito:** Es la meta del autor: ¿Informar? ¿Convencer? ¿Narrar? ¿Describir?

## Cómo suele preguntar el ICFES
- "¿Cuál de los siguientes enunciados resume mejor el texto?"
- "¿Cuál es la intención principal del autor?"
- Trampa típica: Elegir una opción que es cierta (aparece en el texto) pero es solo un detalle secundario, no la idea global.

## Ejemplo tipo ICFES (explicado)
**Texto:** "Aunque muchos creen que los videojuegos aíslan a los jóvenes, estudios recientes demuestran que fomentan habilidades sociales y trabajo en equipo en entornos digitales."
**Pregunta:** ¿Cuál es la idea central del texto?
A) Los videojuegos son peligrosos.
B) Los jóvenes juegan mucho.
C) Los videojuegos pueden desarrollar habilidades sociales.
D) Los estudios recientes son digitales.

**Análisis:**
- A: Contradice el texto.
- B: Es muy general.
- C: **Correcta.** Resume el hallazgo principal mencionado.
- D: Irrelevante.

## Resumen para memorizar
- Pregúntate: ¿De qué se habla todo el tiempo?
- Diferencia entre TEMA (una frase) e IDEA (una oración completa).
- El propósito depende del tipo de texto (Argumentativo -> Convencer)."""
    },
    {
        "id": "lectura_inferencias",
        "title": "Inferencias explícitas e implícitas",
        "order": 2,
        "content": """# Inferencias explícitas e implícitas (ICFES)

## ¿Qué evalúa el ICFES aquí?
Tu habilidad para "leer entre líneas". El ICFES ama preguntar cosas que no están escritas literalmente pero que se deducen lógicamente.

## Conceptos clave (lo que sí o sí debo saber)
- **Información Explícita:** Está escrita tal cual. Solo necesitas ubicarla. (Nivel literal).
- **Información Implícita:** No está escrita, pero el texto da pistas para concluirla. (Nivel inferencial).
- **Inferencia válida:** Conclusión basada 100% en evidencias del texto, no en tu opinión personal.

## Cómo suele preguntar el ICFES
- "Del texto se puede deducir que..."
- "El autor sugiere que..."
- Trampa típica: Sobre-inferir. Asumir cosas que el texto no apoya, basándote en tus prejuicios o conocimientos externos.

## Ejemplo tipo ICFES (explicado)
**Texto:** "Juan llegó con el paraguas empapado y los zapatos llenos de lodo."
**Pregunta:** ¿Qué se puede inferir de la situación?
A) Juan odia la lluvia.
B) Está lloviendo fuerte afuera.
C) Juan caminó por el parque.
D) Juan compró un paraguas nuevo.

**Análisis:**
- A: No sabemos sus sentimientos.
- B: **Correcta.** Si el paraguas y zapatos están mojados/sucios, es la causa lógica.
- C: No sabemos por dónde caminó.
- D: No hay datos de compra.

## Resumen para memorizar
- Explícito = Ojos (está ahí).
- Implícito = Cerebro (se deduce).
- Si la opción dice algo que tú crees pero el texto no dice, ¡es una trampa!"""
    },
    {
        "id": "lectura_intencion",
        "title": "Intención comunicativa del autor",
        "order": 3,
        "content": """# Intención comunicativa del autor (ICFES)

## ¿Qué evalúa el ICFES aquí?
Identificar por qué y para qué escribió el autor. Todo texto tiene una agenda oculta o visible.

## Conceptos clave (lo que sí o sí debo saber)
- **Persuadir/Convencer:** Típico de ensayos y columnas de opinión. Busca cambiar tu forma de pensar.
- **Informar/Exponer:** Típico de noticias o textos científicos. Presenta hechos objetivos.
- **Narrar/Entretener:** Típico de cuentos y novelas. Cuenta una historia.
- **Cuestionar/Criticar:** Busca poner en duda una idea establecida.

## Cómo suele preguntar el ICFES
- "¿Cuál es el propósito principal del autor al mencionar X?"
- "El autor escribe este texto para..."
- Trampa típica: Confundir la intención de un *párrafo* con la intención de *todo el texto*.

## Ejemplo tipo ICFES (explicado)
**Texto:** "Es urgente reducir el consumo de plástico. Si no actuamos ya, nuestros océanos colapsarán en 2050. No seas parte del problema."
**Pregunta:** La intención del autor es:
A) Describir la composición del plástico.
B) Narrar la historia de los océanos.
C) Convencer al lector de actuar ecológicamente.
D) Informar sobre fechas futuras.

**Análisis:**
- A y B: Incorrectas, no describe ni narra.
- C: **Correcta.** Usa imperativos ("No seas") y advertencias para mover a la acción.
- D: Es un detalle, no el fin.

## Resumen para memorizar
- Busca verbos clave: Convencer, Informar, Narrar.
- Fíjate en el tono: ¿Es objetivo (neutro) o subjetivo (opinión)?
- Opinión = Persuadir."""
    },
    {
        "id": "lectura_relaciones_parrafos",
        "title": "Relaciones entre párrafos",
        "order": 4,
        "content": """# Relaciones entre párrafos (ICFES)

## ¿Qué evalúa el ICFES aquí?
Entender cómo se arma el rompecabezas del texto. ¿Qué hace el párrafo 2 respecto al 1?

## Conceptos clave (lo que sí o sí debo saber)
- **Ampliar/Explicar:** El segundo párrafo da más detalles de lo dicho en el primero.
- **Contradecir/Refutar:** El segundo párrafo ataca la idea del primero (busca conectores como "Sin embargo").
- **Ejemplificar:** El segundo párrafo da un caso concreto de la teoría del primero.
- **Concluir:** El último párrafo cierra las ideas anteriores.

## Cómo suele preguntar el ICFES
- "¿Cuál es la relación entre el primer y el segundo párrafo?"
- "¿Qué función cumple el tercer párrafo en el texto?"

## Ejemplo tipo ICFES (explicado)
**Párrafo 1:** "La inteligencia artificial (IA) promete revolucionar la medicina."
**Párrafo 2:** "Por ejemplo, el sistema Watson ya diagnostica cáncer con mayor precisión que los humanos."
**Pregunta:** ¿Qué hace el párrafo 2?
A) Contradice al 1.
B) Resume al 1.
C) Ejemplifica la idea del 1.
D) Introduce un nuevo tema.

**Análisis:**
- C: **Correcta.** "Por ejemplo" es la clave. Muestra un caso de la "revolución" mencionada.

## Resumen para memorizar
- Lee el final del párrafo anterior y el inicio del siguiente.
- Busca conectores de transición (Por lo tanto, En cambio, Además).
- Define la función: ¿Suma, resta, o explica?"""
    },
    {
        "id": "lectura_tesis_argumentos",
        "title": "Tesis y argumentos",
        "order": 5,
        "content": """# Tesis y argumentos (ICFES)

## ¿Qué evalúa el ICFES aquí?
Es el corazón de la Lectura Crítica. Debes diferenciar qué piensa el autor (Tesis) y cómo lo defiende (Argumentos).

## Conceptos clave (lo que sí o sí debo saber)
- **Tesis:** La opinión central que el autor defiende. Es una afirmación debatible (ej: "El aborto debe ser legal").
- **Argumento:** La razón o prueba que apoya la tesis (ej: "Porque reduce la mortalidad materna").
- **Contraargumento:** Una idea opuesta que el autor menciona para luego refutarla.

## Cómo suele preguntar el ICFES
- "¿Cuál es la tesis del texto?"
- "¿Qué argumento usa el autor para apoyar su idea?"
- Trampa típica: Confundir un hecho (dato real) con la tesis (opinión).

## Ejemplo tipo ICFES (explicado)
**Texto:** "El fútbol es el deporte rey. Ningún otro deporte mueve tantas pasiones ni dinero a nivel global, como lo demuestran los mundiales."
**Pregunta:** La tesis del texto es:
A) Los mundiales mueven dinero.
B) El fútbol es el deporte rey.
C) El fútbol mueve pasiones.
D) Hay muchos deportes globales.

**Análisis:**
- A y C: Son argumentos (pruebas).
- B: **Correcta.** Es la opinión que el autor quiere probar con los otros datos.

## Resumen para memorizar
- Tesis = Opinión (¿Qué piensa?).
- Argumento = Porqué (¿Por qué lo piensa?).
- La tesis suele estar al inicio o al final (conclusión)."""
    },
    {
        "id": "lectura_tipos_texto",
        "title": "Tipos de textos",
        "order": 6,
        "content": """# Tipos de textos (ICFES)

## ¿Qué evalúa el ICFES aquí?
Clasificar el texto para saber cómo leerlo. No se lee igual un poema que una noticia.

## Conceptos clave (lo que sí o sí debo saber)
- **Argumentativo:** Ensayo, columna de opinión. Tiene tesis y argumentos. Busca convencer.
- **Expositivo/Informativo:** Noticia, enciclopedia. Presenta hechos sin opinar. Busca informar.
- **Narrativo:** Cuento, novela, crónica. Tiene personajes, tiempo y espacio. Cuenta hechos.
- **Discontinuo:** Tablas, gráficas, infografías, cómics.

## Cómo suele preguntar el ICFES
- "¿Qué tipo de texto es el anterior?"
- Trampa típica: Confundir una crónica (narra hechos reales con estilo) con un cuento (ficción).

## Ejemplo tipo ICFES (explicado)
**Texto:** Una tabla con estadísticas de desempleo en Colombia 2023.
**Pregunta:** El texto anterior es:
A) Narrativo continuo.
B) Argumentativo discontinuo.
C) Expositivo discontinuo.
D) Informativo continuo.

**Análisis:**
- C: **Correcta.** Es expositivo (muestra datos) y discontinuo (no se lee linealmente, es una gráfica).

## Resumen para memorizar
- ¿Opina? -> Argumentativo.
- ¿Cuenta historia? -> Narrativo.
- ¿Solo datos? -> Expositivo.
- ¿Tiene dibujos/tablas? -> Discontinuo."""
    },
    {
        "id": "lectura_vocabulario",
        "title": "Vocabulario en contexto",
        "order": 7,
        "content": """# Vocabulario en contexto (ICFES)

## ¿Qué evalúa el ICFES aquí?
No es un diccionario. Evalúa si puedes deducir el significado de una palabra rara según las palabras que la rodean.

## Conceptos clave (lo que sí o sí debo saber)
- **Contexto:** Las oraciones antes y después de la palabra.
- **Polisemia:** Una palabra puede significar cosas distintas según el texto (ej: "Banco" de dinero vs "Banco" de sentarse).

## Cómo suele preguntar el ICFES
- "En el texto, la palabra 'X' se puede reemplazar por..."
- "El término 'Y' se usa con el sentido de..."

## Ejemplo tipo ICFES (explicado)
**Texto:** "El candidato **esgrimió** argumentos sólidos durante el debate para defender su postura."
**Pregunta:** La palabra "esgrimió" significa en este contexto:
A) Usó una espada.
B) Ocultó.
C) Expuso o usó.
D) Atacó.

**Análisis:**
- A: Significado literal (esgrima), no encaja en un debate.
- C: **Correcta.** En un debate, se "usan" o "exponen" argumentos.

## Resumen para memorizar
- Reemplaza la palabra por las opciones. ¿Cuál suena bien y mantiene el sentido?
- No elijas la definición de diccionario si no pega con el texto."""
    },
    {
        "id": "lectura_conectores",
        "title": "Conectores y relaciones lógicas",
        "order": 8,
        "content": """# Conectores y relaciones lógicas (ICFES)

## ¿Qué evalúa el ICFES aquí?
Tu dominio de la cohesión textual. Los conectores son las señales de tránsito del texto.

## Conceptos clave (lo que sí o sí debo saber)
- **Adversativos (Oposición):** Pero, sin embargo, no obstante, aunque. (Cambian el rumbo).
- **Causales (Causa):** Porque, ya que, debido a. (Explican por qué).
- **Consecutivos (Consecuencia):** Por lo tanto, así que, en consecuencia. (El resultado).
- **Aditivos (Suma):** Además, también, asimismo.

## Cómo suele preguntar el ICFES
- "El conector 'Sin embargo' cumple la función de..."
- "¿Qué conector podría reemplazar al subrayado sin cambiar el sentido?"

## Ejemplo tipo ICFES (explicado)
**Texto:** "Quería salir a jugar, **pero** empezó a llover."
**Pregunta:** El conector "pero" indica:
A) Una causa.
B) Una oposición o restricción.
C) Una consecuencia.
D) Una ampliación.

**Análisis:**
- B: **Correcta.** Introduce un obstáculo a la idea anterior.

## Resumen para memorizar
- "Pero" = Freno/Cambio.
- "Porque" = Razón.
- "Por lo tanto" = Resultado.
- Apréndete los sinónimos (Mas = Pero)."""
    },
    {
        "id": "lectura_suposiciones",
        "title": "Suposiciones del autor",
        "order": 9,
        "content": """# Suposiciones del autor (ICFES)

## ¿Qué evalúa el ICFES aquí?
Identificar las creencias base del autor. Lo que él da por hecho sin decirlo explícitamente.

## Conceptos clave (lo que sí o sí debo saber)
- **Premisa:** Una idea base.
- **Prejuicio/Sesgo:** Una opinión previa que afecta cómo escribe el autor.
- **Suposición:** Algo que debe ser verdad para que el argumento del autor tenga sentido.

## Cómo suele preguntar el ICFES
- "El autor asume que..."
- "Para que el argumento sea válido, el autor supone que..."

## Ejemplo tipo ICFES (explicado)
**Texto:** "Como es mujer, seguramente cocina delicioso."
**Pregunta:** ¿Qué suposición (prejuicio) subyace en la frase?
A) Las mujeres estudian gastronomía.
B) Cocinar es difícil.
C) Todas las mujeres tienen habilidad innata para cocinar.
D) A los hombres no les gusta cocinar.

**Análisis:**
- C: **Correcta.** El autor asume esto como verdad absoluta para hacer su afirmación.

## Resumen para memorizar
- Busca lo que está "detrás" del texto.
- Pregúntate: ¿Qué tiene que creer el autor para atreverse a decir eso?"""
    },
    {
        "id": "lectura_punto_vista",
        "title": "Punto de vista y tono",
        "order": 10,
        "content": """# Punto de vista y tono (ICFES)

## ¿Qué evalúa el ICFES aquí?
Detectar la actitud del autor. ¿Está feliz, enojado, es neutral, es irónico?

## Conceptos clave (lo que sí o sí debo saber)
- **Tono Objetivo:** Neutro, sin emociones (científico, noticias).
- **Tono Subjetivo:** Con emociones u opiniones.
- **Tono Irónico/Sarcástico:** Dice lo contrario de lo que piensa para burlarse.
- **Tono Crítico:** Juzga o evalúa algo negativamente.

## Cómo suele preguntar el ICFES
- "¿Cuál es el tono del autor en el último párrafo?"
- "El autor asume una postura..."

## Ejemplo tipo ICFES (explicado)
**Texto:** "¡Qué maravilla! Otra vez subieron los impuestos. Justo lo que necesitábamos para ser felices."
**Pregunta:** El tono del autor es:
A) Entusiasta.
B) Irónico.
C) Resignado.
D) Informativo.

**Análisis:**
- B: **Correcta.** Literalmente dice que es bueno, pero el contexto indica que está molesto. Eso es ironía.

## Resumen para memorizar
- Fíjate en los adjetivos (maravilloso, terrible, inaceptable).
- La ironía es clave en el ICFES (especialmente en columnas de opinión)."""
    }
]

lessons_matematicas = [
    {
        "id": "matematicas_proporcionalidad",
        "title": "Proporcionalidad directa e inversa",
        "order": 1,
        "content": """# Proporcionalidad directa e inversa (ICFES)

## ¿Qué evalúa el ICFES aquí?
La regla de tres. Es el tema MÁS preguntado. Debes saber cuándo multiplicar en cruz y cuándo de frente.

## Conceptos clave (lo que sí o sí debo saber)
- **Directa:** Si una sube, la otra sube. (Más pan, más precio). -> Regla de tres simple (Multiplica cruzado, divide por el que sobra).
- **Inversa:** Si una sube, la otra baja. (Más obreros, menos tiempo). -> Multiplica de frente, divide por el de abajo.

## Cómo suele preguntar el ICFES
- Problemas de recetas de cocina.
- Problemas de velocidad y tiempo.
- Escalas en mapas.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** 3 pintores tardan 12 días en pintar una casa. Si se contratan 6 pintores más (total 9), ¿cuántos días tardarán?
**Análisis:**
- ¿Es directa o inversa? Más pintores = MENOS tiempo. ¡Es Inversa!
- 3 pintores -> 12 días
- 9 pintores -> X días
- Operación: (3 * 12) / 9 = 36 / 9 = 4.
**Respuesta:** 4 días. (Si usaras directa daría 36 días, ¡absurdo!).

## Resumen para memorizar
- Pregunta siempre: ¿Si aumento esto, lo otro aumenta o disminuye?
- Directa = Cruz.
- Inversa = Frente."""
    },
    {
        "id": "matematicas_porcentajes",
        "title": "Porcentajes y variaciones",
        "order": 2,
        "content": """# Porcentajes y variaciones (ICFES)

## ¿Qué evalúa el ICFES aquí?
Descuentos, IVA, aumentos de sueldo y partes de un todo.

## Conceptos clave (lo que sí o sí debo saber)
- **El 10%:** Mueve la coma un puesto a la izquierda. (10% de 500 es 50).
- **El 50%:** Es la mitad.
- **Aumento:** Multiplica por 1.X (Aumento del 20% -> Multiplica por 1.20).
- **Descuento:** Multiplica por 0.X (Descuento del 20% -> Pagas el 80% -> Multiplica por 0.80).

## Cómo suele preguntar el ICFES
- "Si el precio subió 10% y luego bajó 10%, ¿volvió al precio original?" (NO).
- Gráficas de torta.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Una camisa vale 100.000. Sube el 10% y al mes siguiente baja el 10%. ¿Cuánto vale ahora?
**Análisis:**
1. Sube 10%: 100.000 + 10.000 = 110.000.
2. Baja 10% (¡de 110.000!): El 10% de 110.000 es 11.000.
3. Resta: 110.000 - 11.000 = 99.000.
**Respuesta:** 99.000 (No 100.000).

## Resumen para memorizar
- Los porcentajes no se suman ni restan directamente si la base cambia.
- Usa fracciones simples: 25% = 1/4, 20% = 1/5."""
    },
    {
        "id": "matematicas_razones",
        "title": "Razones y tasas",
        "order": 3,
        "content": """# Razones y tasas (ICFES)

## ¿Qué evalúa el ICFES aquí?
Comparar cantidades. Entender qué significa "3 de cada 4".

## Conceptos clave (lo que sí o sí debo saber)
- **Razón:** Una división o fracción. "3 a 5" se escribe 3/5 o 3:5.
- **Tasa:** Razón con unidades distintas (km/hora, pesos/mes).

## Cómo suele preguntar el ICFES
- "La razón entre hombres y mujeres es 2:3. Si hay 20 hombres, ¿cuántas mujeres hay?"

## Ejemplo tipo ICFES (explicado)
**Enunciado:** En un salón, por cada 2 hombres hay 3 mujeres. Si en total hay 30 estudiantes, ¿cuántos son hombres?
**Análisis:**
- Razón 2:3 significa grupos de 2+3 = 5 personas.
- ¿Cuántos grupos de 5 caben en 30? 30 / 5 = 6 grupos.
- Hombres: 2 * 6 = 12.
- Mujeres: 3 * 6 = 18.
**Respuesta:** 12 hombres.

## Resumen para memorizar
- Suma las partes de la razón (2+3=5) para saber el tamaño del "grupo base".
- Divide el total por ese grupo base."""
    },
    {
        "id": "matematicas_funciones",
        "title": "Funciones lineales",
        "order": 4,
        "content": """# Funciones lineales (ICFES)

## ¿Qué evalúa el ICFES aquí?
Modelar situaciones de costos fijos y variables. La famosa fórmula $y = mx + b$.

## Conceptos clave (lo que sí o sí debo saber)
- **m (Pendiente):** Lo que cambia o varía (costo por minuto, velocidad).
- **b (Intercepto):** El valor fijo o inicial (cargo básico, costo de entrada).
- **Gráfica:** Es una línea recta.

## Cómo suele preguntar el ICFES
- Tarifas de taxis o planes de celular.
- "¿Cuál gráfica representa el costo?"

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Un técnico cobra $20.000 por la visita y $5.000 por cada hora de trabajo. ¿Cuál fórmula representa el costo (C) en función de las horas (h)?
**Análisis:**
- Fijo ($b$): 20.000 (se paga aunque trabaje 0 horas).
- Variable ($m$): 5.000 (multiplica a las horas).
- Fórmula: $C = 5000h + 20000$.
**Respuesta:** Busca la opción que tenga el 5000 con la variable.

## Resumen para memorizar
- Fijo va solo.
- Variable va con la letra (x).
- Si sube, pendiente positiva. Si baja, negativa."""
    },
    {
        "id": "matematicas_graficas",
        "title": "Interpretación de gráficas",
        "order": 5,
        "content": """# Interpretación de gráficas (ICFES)

## ¿Qué evalúa el ICFES aquí?
No es calcular, es LEER el dibujo. Barras, líneas y tortas.

## Conceptos clave (lo que sí o sí debo saber)
- **Ejes:** Mira SIEMPRE qué dice el eje X (horizontal) y el eje Y (vertical). ¿Son años? ¿Son millones de pesos?
- **Tendencia:** ¿Sube, baja o se mantiene constante?
- **Picos:** ¿Dónde está el máximo y el mínimo?

## Cómo suele preguntar el ICFES
- "¿En qué año hubo mayor crecimiento?" (Ojo: Crecimiento no es lo mismo que el valor más alto, es la pendiente más inclinada).
- Comparar dos barras.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Gráfica de ventas. Enero (100), Febrero (120), Marzo (110).
**Pregunta:** ¿Qué pasó en Marzo?
A) Las ventas fueron las más bajas.
B) Las ventas disminuyeron respecto a Febrero.
C) Las ventas aumentaron respecto a Enero.
D) B y C son correctas.

**Análisis:**
- Marzo (110) es menor que Febrero (120) -> Bajó.
- Marzo (110) es mayor que Enero (100) -> Subió respecto a Enero.
**Respuesta:** D. Hay que leer con cuidado las referencias.

## Resumen para memorizar
- Lee los títulos de los ejes antes que nada.
- Cuidado con las escalas (a veces no empiezan en cero)."""
    },
    {
        "id": "matematicas_promedios",
        "title": "Promedios, mediana y moda",
        "order": 6,
        "content": """# Promedios, mediana y moda (ICFES)

## ¿Qué evalúa el ICFES aquí?
Estadística básica. Saber cuál medida usar para resumir datos.

## Conceptos clave (lo que sí o sí debo saber)
- **Promedio (Media):** Suma todo y divide por la cantidad. (Sensible a valores extremos).
- **Mediana:** El dato del medio cuando los ordenas de menor a mayor. (Mejor si hay datos muy locos).
- **Moda:** El que más se repite.

## Cómo suele preguntar el ICFES
- "¿Cuál medida representa mejor los datos?"
- Calcular un promedio simple.

## Ejemplo tipo ICFES (explicado)
**Datos:** Notas de un estudiante: 1.0, 5.0, 5.0, 5.0.
**Pregunta:** ¿Cuál es el promedio y la mediana?
**Análisis:**
- Promedio: (1+5+5+5)/4 = 16/4 = 4.0.
- Mediana: Ordenados (1, 5, 5, 5). El centro está entre 5 y 5. Mediana = 5.0.
**Nota:** Aquí la mediana (5.0) representa mejor al estudiante que el promedio (4.0) porque el 1.0 fue un accidente.

## Resumen para memorizar
- Promedio = Repartir equitativamente.
- Mediana = El centro (ordenando).
- Moda = Lo popular."""
    },
    {
        "id": "matematicas_probabilidad",
        "title": "Probabilidad básica",
        "order": 7,
        "content": """# Probabilidad básica (ICFES)

## ¿Qué evalúa el ICFES aquí?
La fracción de éxito. Casos favorables sobre casos totales.

## Conceptos clave (lo que sí o sí debo saber)
- **Fórmula:** $P = \frac{\text{Casos Favorables}}{\text{Casos Totales}}$
- **Rango:** Va de 0 (imposible) a 1 (seguro). O de 0% a 100%.
- **Suma:** La probabilidad de que pase algo + la de que NO pase = 1.

## Cómo suele preguntar el ICFES
- Sacar balotas de una bolsa.
- Lanzar dados.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Una bolsa tiene 3 bolas rojas y 2 azules. ¿Cuál es la probabilidad de sacar una azul?
**Análisis:**
- Casos Totales: 3 + 2 = 5 bolas.
- Casos Favorables (Azules): 2.
- Probabilidad: 2/5.
- En decimal: 0.4.
- En porcentaje: 40%.
**Respuesta:** 2/5.

## Resumen para memorizar
- Cuenta SIEMPRE el total primero (el denominador).
- Si sacas una bola y no la devuelves, el total disminuye para la siguiente (Ojo a eso)."""
    },
    {
        "id": "matematicas_conteo",
        "title": "Conteo simple (Combinatoria)",
        "order": 8,
        "content": """# Conteo simple (ICFES)

## ¿Qué evalúa el ICFES aquí?
Principio de multiplicación. Cuántas formas hay de vestirse o armar menús.

## Conceptos clave (lo que sí o sí debo saber)
- **Principio de Multiplicación:** Si tienes 3 camisas y 2 pantalones, tienes $3 \times 2 = 6$ pintas.
- **Permutación:** Importa el orden (Clave de cajero).
- **Combinación:** No importa el orden (Ensalada de frutas).

## Cómo suele preguntar el ICFES
- Menús de restaurante (sopa, seco, jugo).
- Placas de carros.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Un menú ofrece 2 entradas, 3 platos fuertes y 2 postres. ¿Cuántas combinaciones de almuerzo completo hay?
**Análisis:**
- Simplemente multiplica las opciones de cada etapa.
- $2 \times 3 \times 2 = 12$.
**Respuesta:** 12 combinaciones.

## Resumen para memorizar
- Si son eventos independientes (uno tras otro), MULTIPLICA.
- No te compliques con fórmulas de factoriales a menos que sea estricto."""
    },
    {
        "id": "matematicas_algebra",
        "title": "Álgebra básica (despejes)",
        "order": 9,
        "content": """# Álgebra básica (ICFES)

## ¿Qué evalúa el ICFES aquí?
Traducir del español al "matemático". Plantear ecuaciones simples.

## Conceptos clave (lo que sí o sí debo saber)
- **"El doble de un número":** $2x$
- **"Un número aumentado en 5":** $x + 5$
- **Despejar:** Lo que suma pasa a restar, lo que multiplica pasa a dividir.

## Cómo suele preguntar el ICFES
- "La edad del padre es el doble de la del hijo..."
- Encontrar el valor de X en una figura geométrica.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** La suma de dos números es 20. Uno es el triple del otro. ¿Cuáles son?
**Análisis:**
- Número 1: $x$
- Número 2: $3x$ (el triple)
- Ecuación: $x + 3x = 20$
- $4x = 20$
- $x = 20 / 4 = 5$.
- Los números son 5 y 15.
**Respuesta:** 5 y 15.

## Resumen para memorizar
- Define bien quién es X.
- Verifica tu respuesta al final (¿5 + 15 da 20? Sí)."""
    },
    {
        "id": "matematicas_geometria",
        "title": "Geometría básica",
        "order": 10,
        "content": """# Geometría básica (ICFES)

## ¿Qué evalúa el ICFES aquí?
Áreas y perímetros de figuras simples (cuadrados, triángulos, círculos). Y volúmenes de cajas.

## Conceptos clave (lo que sí o sí debo saber)
- **Perímetro:** Suma de los lados (borde).
- **Área Rectángulo:** Base x Altura.
- **Área Triángulo:** (Base x Altura) / 2.
- **Volumen Caja:** Largo x Ancho x Alto.

## Cómo suele preguntar el ICFES
- "¿Cuánta pintura necesito para pintar esta pared?" (Área).
- "¿Cuánta cerca necesito para este lote?" (Perímetro).
- Comparar áreas si se duplica un lado.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Tengo un cuadrado de lado 2m. Si duplico el lado a 4m, ¿qué pasa con el área?
**Análisis:**
- Área 1: $2 \times 2 = 4 m^2$.
- Área 2: $4 \times 4 = 16 m^2$.
- De 4 a 16, el área se cuadruplicó (x4), no se duplicó.
**Respuesta:** El área se cuadruplica.

## Resumen para memorizar
- Si duplicas los lados, el área se cuadruplica ($2^2$).
- Si triplicas los lados, el área se multiplica por 9 ($3^2$).
- Perímetro es lineal, Área es cuadrática."""
    }
]

for lesson in lessons_lectura:
    md_content = f"---\nid: {lesson['id']}\narea: lectura_critica\norder: {lesson['order']}\ntype: lesson\n---\n\n{lesson['content']}"
    write_lesson(f"{lesson['id']}.md", md_content)

for lesson in lessons_matematicas:
    md_content = f"---\nid: {lesson['id']}\narea: matematicas\norder: {lesson['order']}\ntype: lesson\n---\n\n{lesson['content']}"
    write_lesson(f"{lesson['id']}.md", md_content)

print("Batch 1 (Lectura y Matemáticas) generado exitosamente.")
