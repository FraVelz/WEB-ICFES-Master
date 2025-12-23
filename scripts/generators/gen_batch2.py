import os

OUTPUT_DIR = "/home/fravelz/Documentos/WEB-ICFES-Master/scripts/markdown"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def write_lesson(filename, content):
    with open(os.path.join(OUTPUT_DIR, filename), "w", encoding="utf-8") as f:
        f.write(content)

lessons_ciencias = [
    {
        "id": "ciencias_metodo",
        "title": "Método científico",
        "order": 1,
        "content": """# Método científico (ICFES)

## ¿Qué evalúa el ICFES aquí?
No te pide recitar los pasos, sino aplicarlos. Identificar hipótesis, experimentos y conclusiones.

## Conceptos clave (lo que sí o sí debo saber)
- **Observación:** Ver un fenómeno.
- **Hipótesis:** Una posible explicación (suposición) que se puede probar. "Si hago X, pasará Y".
- **Experimento:** La prueba para ver si la hipótesis es cierta.
- **Conclusión:** El resultado final basado en datos.

## Cómo suele preguntar el ICFES
- "Un estudiante quiere saber si la luz afecta el crecimiento de las plantas. ¿Cuál sería una hipótesis válida?"
- "¿Qué conclusión se puede sacar de la tabla de datos?"

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Juan cree que el agua salada hierve más rápido que la dulce. Pone dos ollas iguales al fuego, una con sal y otra sin sal. Mide el tiempo.
**Pregunta:** ¿Qué representa la afirmación "el agua salada hierve más rápido"?
A) Una observación.
B) Una conclusión.
C) Una hipótesis.
D) Una teoría.

**Análisis:**
- C: **Correcta.** Es lo que él *cree* antes de probarlo. Es su predicción.

## Resumen para memorizar
- Hipótesis = Predicción (antes).
- Conclusión = Verdad demostrada (después)."""
    },
    {
        "id": "ciencias_variables",
        "title": "Variables dependientes e independientes",
        "order": 2,
        "content": """# Variables dependientes e independientes (ICFES)

## ¿Qué evalúa el ICFES aquí?
Diseño experimental. Saber qué cambias y qué mides.

## Conceptos clave (lo que sí o sí debo saber)
- **Independiente (Causa):** La que tú manipulas o cambias. (Ej: Cantidad de abono).
- **Dependiente (Efecto):** La que cambia sola como respuesta. La que mides. (Ej: Altura de la planta).
- **Controlada:** Las que dejas quietas para no dañar el experimento (Ej: Misma cantidad de luz y agua).

## Cómo suele preguntar el ICFES
- "¿Cuál es la variable dependiente en este experimento?"
- Gráficas: La Independiente suele ir en el eje X (horizontal), la Dependiente en el eje Y (vertical).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Se estudia cómo afecta la temperatura a la solubilidad del azúcar. Se calienta agua a 20°C, 40°C y 60°C y se mide cuánta azúcar se disuelve.
**Pregunta:** La variable independiente es:
A) La cantidad de azúcar disuelta.
B) La temperatura del agua.
C) El tipo de recipiente.
D) El tiempo.

**Análisis:**
- B: **Correcta.** Es lo que el científico cambió a propósito (20, 40, 60) para ver qué pasaba.

## Resumen para memorizar
- Independiente = Yo la cambio (Causa).
- Dependiente = Ella cambia (Efecto/Resultado)."""
    },
    {
        "id": "ciencias_graficas",
        "title": "Interpretación de gráficas científicas",
        "order": 3,
        "content": """# Interpretación de gráficas científicas (ICFES)

## ¿Qué evalúa el ICFES aquí?
Leer datos experimentales. Relacionar variables.

## Conceptos clave (lo que sí o sí debo saber)
- **Relación Directa:** La línea sube. (A mayor temperatura, mayor presión).
- **Relación Inversa:** La línea baja. (A mayor altura, menor presión).
- **Punto de saturación:** Cuando la línea se vuelve horizontal (ya no cambia aunque aumentes la variable X).

## Cómo suele preguntar el ICFES
- "¿A partir de qué minuto la temperatura se mantiene constante?"
- Comparar dos grupos en una misma gráfica.

## Ejemplo tipo ICFES (explicado)
**Gráfica:** Muestra la velocidad de una reacción enzimática. Sube rápido al principio y luego se aplana.
**Pregunta:** ¿Qué pasa después del minuto 10 (donde se aplana)?
A) La reacción se detiene.
B) La velocidad es máxima y constante.
C) La enzima muere.
D) La velocidad disminuye.

**Análisis:**
- B: **Correcta.** Si la línea es horizontal en un valor alto, significa que sigue a esa velocidad, no que sea cero.

## Resumen para memorizar
- Horizontal = Constante (no cambia).
- Pendiente positiva = Aumenta.
- Pendiente negativa = Disminuye."""
    },
    {
        "id": "ciencias_cambios",
        "title": "Cambios físicos y químicos",
        "order": 4,
        "content": """# Cambios físicos y químicos (ICFES)

## ¿Qué evalúa el ICFES aquí?
Diferenciar si la materia cambió de identidad o solo de forma.

## Conceptos clave (lo que sí o sí debo saber)
- **Cambio Físico:** La sustancia sigue siendo la misma. (Hielo derritiéndose sigue siendo agua H2O). Cambios de estado, cortar, arrugar.
- **Cambio Químico:** Se crea una sustancia nueva. (Quemar papel -> Ceniza). Oxidación, combustión, fermentación. Pistas: Burbujas, cambio de color, calor.

## Cómo suele preguntar el ICFES
- "¿Cuál de los siguientes es un cambio químico?"
- Situaciones de cocina (cocinar un huevo vs batirlo).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Se tienen dos procesos: 1) Disolver sal en agua. 2) Quemar madera.
**Pregunta:**
A) Ambos son físicos.
B) 1 es físico y 2 es químico.
C) 1 es químico y 2 es físico.
D) Ambos son químicos.

**Análisis:**
- 1: Físico. Si evaporas el agua, recuperas la sal. No hay sustancia nueva.
- 2: Químico. La madera se vuelve carbón y humo. Irreversible.
**Respuesta:** B.

## Resumen para memorizar
- ¿Puedo volver atrás fácilmente? -> Probablemente Físico.
- ¿Se quemó, oxidó o pudrió? -> Químico."""
    },
    {
        "id": "ciencias_ecosistemas",
        "title": "Ecosistemas y relaciones tróficas",
        "order": 5,
        "content": """# Ecosistemas y relaciones tróficas (ICFES)

## ¿Qué evalúa el ICFES aquí?
Quién se come a quién y qué pasa si quitas a uno de la cadena.

## Conceptos clave (lo que sí o sí debo saber)
- **Productor:** Plantas (hacen su comida). Base de la pirámide.
- **Consumidor Primario:** Herbívoros (comen plantas).
- **Consumidor Secundario:** Carnívoros/Omnívoros.
- **Competencia:** Dos especies pelean por lo mismo.
- **Depredación:** Uno come, el otro muere.
- **Mutualismo:** Ambos ganan (abeja y flor).

## Cómo suele preguntar el ICFES
- "Si se extinguen las serpientes (consumidor secundario), ¿qué le pasa a los ratones (su comida)?"
- Respuesta típica: Aumentan descontroladamente al principio.

## Ejemplo tipo ICFES (explicado)
**Red trófica:** Pasto -> Grillo -> Sapo -> Serpiente.
**Pregunta:** Si se introduce un insecticida que mata a los grillos, ¿qué pasa con los sapos?
A) Aumentan porque no tienen competencia.
B) Disminuyen porque se quedan sin alimento.
C) Se vuelven herbívoros.
D) No les pasa nada.

**Análisis:**
- B: **Correcta.** Si quitas la comida (grillo), el depredador (sapo) muere o migra.

## Resumen para memorizar
- Flecha en la cadena = "Es comido por" (La energía va del pasto al grillo).
- Si quitas un eslabón, el de abajo crece (plaga) y el de arriba decrece (hambre)."""
    },
    {
        "id": "ciencias_energia",
        "title": "Energía y sus transformaciones",
        "order": 6,
        "content": """# Energía y sus transformaciones (ICFES)

## ¿Qué evalúa el ICFES aquí?
La ley de conservación: La energía no se crea ni se destruye, solo se transforma.

## Conceptos clave (lo que sí o sí debo saber)
- **Cinética:** Energía del movimiento (velocidad).
- **Potencial:** Energía de la altura (posición).
- **Transformación:** Al caer, la Potencial se vuelve Cinética. Al frenar, la Cinética se vuelve Calor (fricción).

## Cómo suele preguntar el ICFES
- Una montaña rusa o un péndulo.
- "¿En qué punto la energía cinética es máxima?" (En el punto más bajo, donde va más rápido).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Un niño se desliza por un tobogán. Al llegar abajo, sus pantalones están calientes.
**Pregunta:** ¿Qué transformación de energía ocurrió?
A) Potencial a Cinética y Térmica.
B) Cinética a Potencial.
C) Térmica a Cinética.
D) Solo Potencial a Cinética.

**Análisis:**
- A: **Correcta.** Tenía altura (Potencial), ganó velocidad (Cinética) y la fricción generó calor (Térmica).

## Resumen para memorizar
- Arriba = Potencial máxima.
- Abajo = Cinética máxima.
- Fricción = Pérdida de energía en forma de calor."""
    },
    {
        "id": "ciencias_fuerzas",
        "title": "Fuerzas y movimiento (básico)",
        "order": 7,
        "content": """# Fuerzas y movimiento (ICFES)

## ¿Qué evalúa el ICFES aquí?
Leyes de Newton conceptuales. No tantas fórmulas complejas.

## Conceptos clave (lo que sí o sí debo saber)
- **Inercia (1ra Ley):** Todo sigue quieto o en línea recta a menos que lo empujen. (Por eso te vas para adelante si el bus frena).
- **Fuerza = Masa x Aceleración (2da Ley):** Para mover algo pesado necesitas más fuerza.
- **Acción-Reacción (3ra Ley):** Si empujas la pared, la pared te empuja a ti.

## Cómo suele preguntar el ICFES
- Diagramas de cuerpo libre (flechitas de fuerzas).
- "¿Por qué un objeto se detiene?" (Fricción).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Un paracaidista cae a velocidad constante. ¿Qué se puede decir de las fuerzas?
A) No hay fuerzas actuando sobre él.
B) La fuerza de gravedad es mayor que la del aire.
C) La fuerza de gravedad y la resistencia del aire se anulan (suman cero).
D) La gravedad desaparece.

**Análisis:**
- C: **Correcta.** Si la velocidad es constante (no acelera), la fuerza neta es CERO. Equilibrio.

## Resumen para memorizar
- Velocidad constante = Fuerzas equilibradas (Suma cero).
- Aceleración = Hay una fuerza ganadora."""
    },
    {
        "id": "ciencias_electricidad",
        "title": "Electricidad básica",
        "order": 8,
        "content": """# Electricidad básica (ICFES)

## ¿Qué evalúa el ICFES aquí?
Circuitos simples. Serie y Paralelo. Conductores y aislantes.

## Conceptos clave (lo que sí o sí debo saber)
- **Circuito Serie:** Un solo camino. Si se funde un bombillo, se apagan todos. (Luces de navidad viejas).
- **Circuito Paralelo:** Varios caminos. Si se funde uno, los otros siguen prendidos. (Las luces de tu casa).
- **Conductor:** Deja pasar corriente (Metales, agua con sal).
- **Aislante:** No deja pasar (Plástico, madera, caucho).

## Cómo suele preguntar el ICFES
- Dibujos de circuitos con bombillos y pilas.
- "¿Qué pasa si abro el interruptor S1?"

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Dos bombillos están en serie. Se añade un tercer bombillo en serie. ¿Qué pasa con la intensidad de la luz?
A) Aumenta.
B) Disminuye.
C) Sigue igual.
D) Se apagan.

**Análisis:**
- B: **Correcta.** En serie, la energía (voltaje) se reparte. Más bombillos = menos luz para cada uno.

## Resumen para memorizar
- Serie = Se reparte el voltaje (menos luz).
- Paralelo = Mismo voltaje para todos (brillan igual)."""
    },
    {
        "id": "ciencias_salud",
        "title": "Salud y sistemas del cuerpo",
        "order": 9,
        "content": """# Salud y sistemas del cuerpo (ICFES)

## ¿Qué evalúa el ICFES aquí?
Relación entre órganos y funciones. Métodos anticonceptivos. Enfermedades comunes.

## Conceptos clave (lo que sí o sí debo saber)
- **Sistema Circulatorio:** Transporta oxígeno y nutrientes (Sangre).
- **Sistema Respiratorio:** Intercambio de gases (O2 entra, CO2 sale).
- **Anticonceptivos:** Barrera (Condón - previene ETS), Hormonales (Píldora), Definitivos (Ligadura).
- **Vacunas:** Generan anticuerpos (memoria) para prevenir, no para curar.

## Cómo suele preguntar el ICFES
- "¿Qué sistema se afecta principalmente por el cigarrillo?" (Respiratorio y Circulatorio).
- Gráficas de hormonas en el ciclo menstrual.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** ¿Cuál es el único método que previene el embarazo Y las enfermedades de transmisión sexual (ETS)?
A) Píldora.
B) DIU.
C) Condón.
D) Ritmo.

**Análisis:**
- C: **Correcta.** Es el único de barrera física.

## Resumen para memorizar
- Vacuna = Prevención. Antibiótico = Cura bacterias (no virus).
- Condón = Único para ETS."""
    },
    {
        "id": "ciencias_responsable",
        "title": "Uso responsable de la ciencia",
        "order": 10,
        "content": """# Uso responsable de la ciencia (ICFES)

## ¿Qué evalúa el ICFES aquí?
Impacto ambiental y ético. Ciencia, Tecnología y Sociedad (CTS).

## Conceptos clave (lo que sí o sí debo saber)
- **Efecto Invernadero:** Gases (CO2) atrapan calor. Causa: Combustibles fósiles.
- **Reciclaje:** Reducir, Reutilizar, Reciclar.
- **Contaminación:** Minería ilegal (Mercurio en agua), Pesticidas.

## Cómo suele preguntar el ICFES
- "¿Cuál es una consecuencia negativa del uso excesivo de fertilizantes?"
- Dilemas éticos sobre experimentación animal.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Una fábrica vierte agua caliente al río. Aunque el agua está limpia, los peces mueren. ¿Por qué?
A) El agua caliente es tóxica.
B) El calor disminuye el oxígeno disuelto en el agua.
C) Los peces se cocinan.
D) El agua caliente aumenta las bacterias.

**Análisis:**
- B: **Correcta.** Concepto físico-químico: A mayor temperatura, menos gas (oxígeno) se disuelve en el líquido. Asfixia.

## Resumen para memorizar
- Todo avance tecnológico tiene un impacto. El ICFES busca que identifiques el impacto negativo ambiental."""
    }
]

lessons_sociales = [
    {
        "id": "sociales_estado",
        "title": "Estado y organización política",
        "order": 1,
        "content": """# Estado y organización política (ICFES)

## ¿Qué evalúa el ICFES aquí?
Las ramas del poder público. Quién hace qué en Colombia.

## Conceptos clave (lo que sí o sí debo saber)
- **Rama Legislativa (Congreso):** Hace las leyes y reforma la constitución. (Senado y Cámara).
- **Rama Ejecutiva (Presidente, Alcaldes):** Administra y ejecuta las leyes. Maneja la plata.
- **Rama Judicial (Jueces, Cortes):** Juzga y castiga. Resuelve conflictos.
- **Organismos de Control:** Procuraduría (vigila funcionarios), Contraloría (vigila dinero), Defensoría (Derechos Humanos).

## Cómo suele preguntar el ICFES
- "El presidente quiere cambiar una ley, ¿puede hacerlo solo?" (No, debe ir al Congreso).
- "¿Quién investiga a un alcalde corrupto?" (Procuraduría).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Un ciudadano cree que una ley viola sus derechos fundamentales. ¿A qué rama debe acudir?
A) Ejecutiva.
B) Legislativa.
C) Judicial.
D) Electoral.

**Análisis:**
- C: **Correcta.** Los jueces (Corte Constitucional) deciden si una ley es válida o viola derechos (Tutela).

## Resumen para memorizar
- Legislativa = Leyes.
- Ejecutiva = Obras/Administración.
- Judicial = Justicia.
- Pesos y contrapesos: Ninguna rama manda sobre las otras."""
    },
    {
        "id": "sociales_constitucion",
        "title": "Constitución política de Colombia (1991)",
        "order": 2,
        "content": """# Constitución política de Colombia (ICFES)

## ¿Qué evalúa el ICFES aquí?
La "Norma de normas". Saber que Colombia es un "Estado Social de Derecho".

## Conceptos clave (lo que sí o sí debo saber)
- **Estado Social de Derecho:** El Estado debe garantizar derechos básicos (salud, educación, vida digna), no solo poner orden.
- **Supremacía Constitucional:** Ninguna ley puede ir en contra de la Constitución.
- **Tutela:** Mecanismo rápido para proteger derechos fundamentales (vida, salud, debido proceso).

## Cómo suele preguntar el ICFES
- Situaciones donde se viola un derecho y debes elegir el mecanismo de protección (Tutela, Derecho de Petición).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** A un niño le niegan la matrícula en un colegio público por su religión. ¿Qué mecanismo es el más rápido para defenderlo?
A) Denuncia penal.
B) Acción de Tutela.
C) Referendo.
D) Plebiscito.

**Análisis:**
- B: **Correcta.** La educación y la libertad de culto son derechos fundamentales. La tutela es para eso.

## Resumen para memorizar
- Constitución 1991 = Derechos y diversidad.
- Tutela = Derechos Fundamentales (inmediato).
- Acción Popular = Derechos Colectivos (espacio público, ambiente)."""
    },
    {
        "id": "sociales_derechos",
        "title": "Derechos y deberes",
        "order": 3,
        "content": """# Derechos y deberes (ICFES)

## ¿Qué evalúa el ICFES aquí?
El conflicto entre derechos. ¿Qué pasa cuando mi derecho choca con el tuyo?

## Conceptos clave (lo que sí o sí debo saber)
- **Derechos Fundamentales:** Vida, libertad, igualdad, debido proceso.
- **Derechos Colectivos:** Ambiente sano, espacio público.
- **El bien común prima sobre el particular:** (Casi siempre, pero con matices).
- **Límites:** Mis derechos terminan donde empiezan los de los demás.

## Cómo suele preguntar el ICFES
- "Un vecino pone música a todo volumen (Libre desarrollo personalidad) vs Vecinos quieren dormir (Tranquilidad/Intimidad)". ¿Quién gana?
- Gana la tranquilidad porque el derecho de uno no puede afectar la salud/bienestar de otros.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Una alcaldía prohíbe el parrillero en moto para reducir atracos. Los motociclistas protestan por su derecho a la movilidad.
**Pregunta:** ¿Qué tensión de derechos hay?
A) Educación vs Trabajo.
B) Seguridad ciudadana vs Libre circulación.
C) Salud vs Ambiente.
D) Vida vs Propiedad.

**Análisis:**
- B: **Correcta.** La medida busca seguridad (colectivo) limitando la circulación (individual).

## Resumen para memorizar
- Identifica las dos partes del conflicto.
- Busca la opción que nombre los derechos exactos de cada parte."""
    },
    {
        "id": "sociales_democracia",
        "title": "Democracia y participación ciudadana",
        "order": 4,
        "content": """# Democracia y participación ciudadana (ICFES)

## ¿Qué evalúa el ICFES aquí?
Mecanismos de participación. No solo es votar.

## Conceptos clave (lo que sí o sí debo saber)
- **Voto:** Elegir representantes.
- **Plebiscito:** El presidente pregunta SÍ o NO sobre una decisión (Ej: Paz).
- **Referendo:** Aprobar o derogar normas/leyes.
- **Cabildo Abierto:** Reunión pública con concejales/alcalde.
- **Revocatoria del mandato:** Echar a un alcalde o gobernador (NO al presidente) por incumplir el plan de gobierno.

## Cómo suele preguntar el ICFES
- "Los ciudadanos están descontentos con el alcalde porque no cumplió sus promesas. ¿Qué pueden hacer?" (Revocatoria).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** El presidente quiere consultar al pueblo si está de acuerdo con un tratado de paz. ¿Qué mecanismo usa?
A) Referendo.
B) Plebiscito.
C) Consulta Popular.
D) Cabildo abierto.

**Análisis:**
- B: **Correcta.** El plebiscito es para apoyar o rechazar una decisión del ejecutivo.

## Resumen para memorizar
- Alcalde malo = Revocatoria.
- Cambiar Constitución = Referendo.
- Pregunta del Presidente = Plebiscito."""
    },
    {
        "id": "sociales_conflicto",
        "title": "Conflicto armado colombiano (nociones)",
        "order": 5,
        "content": """# Conflicto armado colombiano (ICFES)

## ¿Qué evalúa el ICFES aquí?
Causas y consecuencias históricas. No fechas exactas, sino procesos.

## Conceptos clave (lo que sí o sí debo saber)
- **Causas:** Problema agrario (tierras), exclusión política (Frente Nacional), debilidad del Estado en regiones.
- **Actores:** Guerrillas (Izquierda), Paramilitares (Derecha/Contra-insurgencia), Estado, Narcotráfico.
- **Desplazamiento forzado:** La consecuencia humanitaria más grave y masiva.
- **Frente Nacional:** Acuerdo Liberal-Conservador para turnarse el poder. Acabó la violencia bipartidista pero excluyó a otros, generando guerrillas.

## Cómo suele preguntar el ICFES
- "¿Cuál fue una consecuencia no deseada del Frente Nacional?" (Surgimiento de guerrillas por falta de participación).
- Impacto del narcotráfico en la financiación de la guerra.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Durante los años 80, el conflicto se intensificó y degradó. ¿Qué factor fue determinante en esto?
A) La Guerra Fría.
B) El ingreso del narcotráfico.
C) La caída del muro de Berlín.
D) La constitución del 91.

**Análisis:**
- B: **Correcta.** El narcotráfico dio recursos ilimitados a los grupos armados, volviéndolos más violentos y poderosos.

## Resumen para memorizar
- Tierra = Origen del conflicto.
- Narcotráfico = Combustible del conflicto.
- Víctimas = Centro de la solución."""
    },
    {
        "id": "sociales_economia",
        "title": "Economía básica (oferta y demanda)",
        "order": 6,
        "content": """# Economía básica (ICFES)

## ¿Qué evalúa el ICFES aquí?
Cómo funcionan los precios y el mercado.

## Conceptos clave (lo que sí o sí debo saber)
- **Oferta:** Cantidad de productos disponibles (Vendedores).
- **Demanda:** Cantidad de gente que quiere comprar (Compradores).
- **Ley:**
    - Mucha demanda + Poca oferta = Precios SUBEN (Escasez).
    - Poca demanda + Mucha oferta = Precios BAJAN (Abundancia).
- **Inflación:** Aumento general de precios. El dinero vale menos.
- **Tasa de cambio:** Precio del dólar. Si el dólar sube, ganan los exportadores (reciben más pesos) y pierden los importadores.

## Cómo suele preguntar el ICFES
- "¿A quién beneficia que suba el dólar?" (Cafeteros/Exportadores).
- "¿Qué pasa si hay una sequía y se daña la cosecha de papa?" (Sube el precio por escasez).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Hay una gran cosecha de mango, mucha más que el año pasado. La gente sigue comiendo la misma cantidad. ¿Qué pasará con el precio?
A) Sube.
B) Baja.
C) Se mantiene.
D) El gobierno lo fija.

**Análisis:**
- B: **Correcta.** Hay sobreoferta. Para venderlo antes de que se pudra, deben bajar el precio.

## Resumen para memorizar
- Escasez = Caro.
- Abundancia = Barato.
- Dólar caro = Bueno para el que vende al exterior."""
    },
    {
        "id": "sociales_globalizacion",
        "title": "Globalización",
        "order": 7,
        "content": """# Globalización (ICFES)

## ¿Qué evalúa el ICFES aquí?
Interconexión mundial. Ventajas y desventajas.

## Conceptos clave (lo que sí o sí debo saber)
- **Apertura Económica:** Tratados de Libre Comercio (TLC). Bajan impuestos (aranceles) para importar y exportar.
- **Ventaja:** Productos más baratos y variados. Tecnología.
- **Desventaja:** Quiebra de industrias locales que no pueden competir con gigantes extranjeros. Pérdida de identidad cultural.

## Cómo suele preguntar el ICFES
- Impacto de un TLC en los campesinos colombianos.
- Choque cultural.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Colombia firma un TLC que permite importar maíz de EE.UU. sin impuestos. El maíz de EE.UU. es más barato porque es subsidiado. ¿Qué consecuencia trae para los campesinos colombianos?
A) Aumentan sus ganancias.
B) Pueden exportar más.
C) Quiebran al no poder competir con precios bajos.
D) Mejoran su tecnología.

**Análisis:**
- C: **Correcta.** El consumidor compra lo barato, el local pierde mercado.

## Resumen para memorizar
- Globalización = Mundo sin fronteras económicas.
- Ganadores = Consumidores y grandes exportadores.
- Perdedores = Pequeños productores locales."""
    },
    {
        "id": "sociales_problemas",
        "title": "Problemas sociales contemporáneos",
        "order": 8,
        "content": """# Problemas sociales contemporáneos (ICFES)

## ¿Qué evalúa el ICFES aquí?
Discriminación, género y medio ambiente.

## Conceptos clave (lo que sí o sí debo saber)
- **Discriminación:** Trato desigual por raza, género, religión.
- **Equidad de género:** Igualdad de oportunidades entre hombres y mujeres. (Techo de cristal, brecha salarial).
- **Desarrollo Sostenible:** Crecer económicamente sin acabar los recursos del futuro.

## Cómo suele preguntar el ICFES
- Casos de discriminación en colegios o trabajos.
- Conflictos entre minería (dinero) y ambiente (agua).

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Una empresa paga menos a las mujeres que a los hombres por el mismo trabajo. Esto vulnera el derecho a:
A) La libertad.
B) La igualdad.
C) La intimidad.
D) La seguridad.

**Análisis:**
- B: **Correcta.** Igualdad: "A trabajo igual, salario igual".

## Resumen para memorizar
- Identifica siempre al grupo vulnerable (minorías, mujeres, indígenas).
- La Constitución protege especialmente a estos grupos (Discriminación positiva)."""
    },
    {
        "id": "sociales_ciudadania",
        "title": "Ciudadanía y convivencia",
        "order": 9,
        "content": """# Ciudadanía y convivencia (ICFES)

## ¿Qué evalúa el ICFES aquí?
Resolución pacífica de conflictos. Manuales de convivencia.

## Conceptos clave (lo que sí o sí debo saber)
- **Debido Proceso:** Nadie puede ser sancionado sin ser escuchado y sin seguir las reglas escritas.
- **Mecanismos de resolución:** Diálogo, Negociación, Mediación (un tercero ayuda), Conciliación.
- **Manual de Convivencia:** No puede estar por encima de la Constitución (Ej: No puede prohibir el pelo largo o noviazgos, eso es libre desarrollo).

## Cómo suele preguntar el ICFES
- "Expulsan a un estudiante por tener el pelo largo. ¿Es correcto?" (No, viola libre desarrollo).
- Vecinos peleando.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Dos estudiantes se pelean. El rector expulsa a ambos inmediatamente sin preguntar qué pasó. ¿Qué derecho violó el rector?
A) Educación.
B) Debido proceso.
C) Libre expresión.
D) Integridad.

**Análisis:**
- B: **Correcta.** Antes de sancionar, hay que investigar y dejar que se defiendan.

## Resumen para memorizar
- El diálogo es siempre la primera opción correcta en el ICFES.
- Las normas del colegio no mandan sobre la Constitución."""
    },
    {
        "id": "sociales_pensamiento",
        "title": "Pensamiento crítico frente a fuentes",
        "order": 10,
        "content": """# Pensamiento crítico frente a fuentes (ICFES)

## ¿Qué evalúa el ICFES aquí?
Saber si una noticia es falsa o si una fuente está sesgada.

## Conceptos clave (lo que sí o sí debo saber)
- **Sesgo:** Cuando la información favorece a un lado. (Ej: Un artículo sobre los beneficios del azúcar escrito por una fábrica de dulces).
- **Fuente Primaria:** Testigo directo, documento original.
- **Fuente Secundaria:** Libros de historia, noticias que cuentan lo que pasó.
- **Corroborar:** Comparar varias fuentes para ver si es verdad.

## Cómo suele preguntar el ICFES
- "¿Por qué esta fuente podría no ser objetiva?"
- Comparar dos versiones de un mismo hecho.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Para investigar sobre los daños del tabaco, ¿cuál fuente es MENOS confiable?
A) Un estudio de la Organización Mundial de la Salud.
B) Un artículo de una universidad prestigiosa.
C) Un folleto publicado por una tabacalera.
D) Un testimonio de un médico.

**Análisis:**
- C: **Correcta (es la menos confiable).** Tienen un interés económico en decir que no hace daño (Conflicto de intereses).

## Resumen para memorizar
- Mira quién escribe. ¿Qué gana con convencerte?
- Si hay intereses de plata o política, duda."""
    }
]

for lesson in lessons_ciencias:
    md_content = f"---\nid: {lesson['id']}\narea: ciencias_naturales\norder: {lesson['order']}\ntype: lesson\n---\n\n{lesson['content']}"
    write_lesson(f"{lesson['id']}.md", md_content)

for lesson in lessons_sociales:
    md_content = f"---\nid: {lesson['id']}\narea: sociales_y_ciudadanas\norder: {lesson['order']}\ntype: lesson\n---\n\n{lesson['content']}"
    write_lesson(f"{lesson['id']}.md", md_content)

print("Batch 2 (Ciencias y Sociales) generado exitosamente.")
