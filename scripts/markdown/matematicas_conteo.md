---
id: matematicas_conteo
title: Conteo simple (Combinatoria)
area: matematicas
order: 8
type: lesson
published: true
description: Aplica el principio de multiplicación para contar combinaciones. Diferencia entre permutaciones (importa el orden) y combinaciones (no importa el orden).
xp: 500
coins: 250
questions:
  - id: matematicas_conteo_1
    type: opcion_multiple
    question: "Un menú ofrece 2 entradas, 3 platos fuertes y 2 postres. ¿Cuántas combinaciones de almuerzo completo hay?"
    options:
      - "7 combinaciones"
      - "12 combinaciones"
      - "6 combinaciones"
      - "10 combinaciones"
    correct_answer: 1
    explanation: "Se multiplican las opciones de cada etapa: 2 × 3 × 2 = 12 combinaciones. Esto es el principio de multiplicación para eventos independientes."
    difficulty: media
  - id: matematicas_conteo_2
    type: opcion_multiple
    question: "Si tienes 3 camisas y 2 pantalones, ¿cuántas combinaciones de ropa puedes hacer?"
    options:
      - "5 combinaciones"
      - "6 combinaciones"
      - "3 combinaciones"
      - "2 combinaciones"
    correct_answer: 1
    explanation: "Se multiplican las opciones: 3 camisas × 2 pantalones = 6 combinaciones diferentes."
    difficulty: facil
  - id: matematicas_conteo_3
    type: opcion_multiple
    question: "¿Cuál es la diferencia entre permutación y combinación?"
    options:
      - "No hay diferencia"
      - "En permutación importa el orden (clave de cajero), en combinación no importa (ensalada de frutas)"
      - "En combinación importa el orden"
      - "Ambas son iguales"
    correct_answer: 1
    explanation: "En permutación importa el orden (ej: clave 123 es diferente de 321). En combinación no importa el orden (ej: ensalada con manzana y naranja es igual sin importar el orden)."
    difficulty: facil
---

# Conteo simple (ICFES)

## ¿Qué evalúa el ICFES aquí?
Principio de multiplicación. Cuántas formas hay de vestirse o armar menús.

## Conceptos clave (lo que sí o sí debo saber)
- **Principio de Multiplicación:** Si tienes 3 camisas y 2 pantalones, tienes $3 	imes 2 = 6$ pintas.
- **Permutación:** Importa el orden (Clave de cajero).
- **Combinación:** No importa el orden (Ensalada de frutas).

## Cómo suele preguntar el ICFES
- Menús de restaurante (sopa, seco, jugo).
- Placas de carros.

## Ejemplo tipo ICFES (explicado)
**Enunciado:** Un menú ofrece 2 entradas, 3 platos fuertes y 2 postres. ¿Cuántas combinaciones de almuerzo completo hay?
**Análisis:**
- Simplemente multiplica las opciones de cada etapa.
- $2 	imes 3 	imes 2 = 12$.
**Respuesta:** 12 combinaciones.

## Resumen para memorizar
- Si son eventos independientes (uno tras otro), MULTIPLICA.
- No te compliques con fórmulas de factoriales a menos que sea estricto.