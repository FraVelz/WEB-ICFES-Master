# Guía de visuales en lecciones

Esta guía describe cómo agregar **tablas**, **fórmulas** y **gráficas** en `learning_content.content` para fases 2 y 3.

## Tablas (Markdown GFM)

```markdown
| Variable    | Valor |
| ----------- | ----- |
| Temperatura | 25 °C |
| Presión     | 1 atm |
```

## Matemáticas (KaTeX)

Inline: `$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$`

Bloque:

```markdown
$$
P(A \cap B) = P(A) \cdot P(B|A)
$$
```

## Gráficas desde JSON (`visuals`)

En `content.visuals`:

```json
{
  "visuals": [
    {
      "type": "chart",
      "chartType": "bar",
      "title": "Gasto mensual del hogar",
      "labels": ["Ene", "Feb", "Mar"],
      "series": [{ "name": "Miles COP", "values": [420, 510, 480] }]
    }
  ]
}
```

Referencia en el cuerpo:

```markdown
Observa la tendencia del gasto:

{{visual:0}}
```

## Gráficas embebidas (`chart-json`)

````markdown
```chart-json
{
  "chartType": "line",
  "title": "Temperatura diaria",
  "labels": ["Lun", "Mar", "Mié"],
  "series": [{ "name": "°C", "values": [18, 21, 19] }]
}
```
````

````

## Tablas estructuradas (`visuals`)

```json
{
  "type": "table",
  "title": "Resultados del experimento",
  "headers": ["Muestra", "pH"],
  "rows": [["A", "6.8"], ["B", "7.1"]]
}
````

## Escalado por fase

| Fase | ND  | Uso recomendado                                         |
| ---- | --- | ------------------------------------------------------- |
| 1    | 1–2 | Tabla simple, 1 dato, gráfica de barras básica          |
| 2    | 2–3 | Cruzar tabla + texto; gráfica con 2 series              |
| 3    | 3–4 | Validar conclusión con gráfica; detectar error en datos |

Campos DCE opcionales en `content`:

- `performance_level`: 1–4
- `competency`: afirmación ICFES
- `evidence`: conducta observable
