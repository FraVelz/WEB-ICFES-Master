# URLs

Estas son las **URLs** del proyecto:

## Páginas principales

| URL                | Descripción            |
| ------------------ | ---------------------- |
| `/`                | Home                   |
| `/login`           | Iniciar sesión         |
| `/signup`          | Registro               |
| `/onboarding`      | Onboarding inicial     |
| `/forgot-password` | Recuperar contraseña   |
| `/reset-password`  | Restablecer contraseña |
| `/privacidad`      | Política de privacidad |
| `/terminos`        | Términos y condiciones |

## Dashboard (requiere sesión o demo)

| URL                 | Descripción                       |
| ------------------- | --------------------------------- |
| `/ruta-aprendizaje` | Ruta de aprendizaje (con chat IA) |
| `/logros`           | Logros y gamificación             |
| `/perfil`           | Perfil del usuario                |
| `/perfil/public`    | Perfil público                    |
| `/clasificatoria`   | Clasificación / ranking           |
| `/desafios-diarios` | Desafíos diarios                  |
| `/configuracion`    | Configuración                     |
| `/examen-completo`  | Simulacro completo                |

## Práctica (por área)

| URL                             | Descripción                    |
| ------------------------------- | ------------------------------ |
| `/practica/lectura-critica`     | Práctica Lectura Crítica       |
| `/practica/matematicas`         | Práctica Matemáticas           |
| `/practica/ciencias-naturales`  | Práctica Ciencias Naturales    |
| `/practica/sociales-ciudadanas` | Práctica Sociales y Ciudadanas |

## Lecciones (por área y tema)

| URL                       | Ejemplo                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `/lessons/[area]/[topic]` | `/lessons/matematicas/algebra`, `/lessons/lenguaje/gramatica`, etc. |

**Áreas y temas:**

- **Matemáticas:** algebra, geometria, calculo, trigonometria, numeros-complejos
- **Lenguaje:** gramatica, comprension, literatura, ortografia, semantica
- **Ciencias:** biologia, fisica, quimica, ecologia, termodinamica
- **Sociales:** historia, geografia, economia, ciudadania, filosofia

## API

| URL         | Método | Descripción                              |
| ----------- | ------ | ---------------------------------------- |
| `/api/chat` | POST   | Chat con ChatGPT para el asistente ICFES |
