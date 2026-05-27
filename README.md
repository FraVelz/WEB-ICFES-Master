# Web Icfes Master - Domina el ICFES desde Cero 📝

[English version](README.en.md)

Una plataforma interactiva para practicar preguntas y aprender temas del examen de estado ICFES (Saber 11) en Colombia.
Diseñada con arquitectura **feature-based** usando Next.js 15, React 19, Tailwind CSS 4 y Supabase.

> [!NOTE] Se buscaba abarcar muchos más países además de Colombia, pero cada país maneja la educación de forma distinta:
> las preguntas, los temas y las materias cambian. Incluso hay países donde el examen no es obligatorio o no existe.
>
> [!IMPORTANT] Donaciones y tienda/planes están **en desarrollo**. Ver [integrations/payments.md](docs/es/integrations/payments.md).

![Hero section de la plataforma ICFES - Domina el ICFES desde Cero](public/images/screenshot.png)

---

## Temario

- [Web Icfes Master - Domina el ICFES desde Cero 📝](#web-icfes-master---domina-el-icfes-desde-cero-)
  - [Temario](#temario)
  - [Características Principales](#características-principales)
  - [Documentación técnica](#documentación-técnica)
  - [Pasos para Contribuir](#pasos-para-contribuir)
  - [Contacto](#contacto)

---

## Características Principales

Para las áreas de Lectura Crítica, Sociales, Inglés, Matemáticas y Ciencias:

- Conceptos por área, lecciones interactivas y preguntas asociadas a cada lección.
- Práctica con preguntas agrupadas por materia.
- Simulacros tipo ICFES con tiempo limitado y formato global.

---

## Documentación técnica

Carpeta: [`docs/es/`](docs/es/) — Índice: [overview.md](docs/es/overview/overview.md)

| Documento                                                               | Descripción                  |
| ----------------------------------------------------------------------- | ---------------------------- |
| [installation.md](docs/es/setup/installation.md)                        | Instalación local            |
| [configuration.md](docs/es/setup/configuration.md)                      | Variables de entorno y modos |
| [technologies.md](docs/es/setup/technologies.md)                        | Stack completo               |
| [routes.md](docs/es/setup/routes.md)                                    | URLs de la app               |
| [architecture.md](docs/es/frontend/architecture.md)                     | Reglas feature-based         |
| [project-structure.md](docs/es/overview/project-structure.md)           | Árbol de carpetas            |
| [components-guide.md](docs/es/frontend/components-guide.md)             | Componentes y hooks          |
| [services-api.md](docs/es/backend/services-api.md)                      | Persistencia y Supabase      |
| [learning-structure-guide.md](docs/es/data/learning-structure-guide.md) | Roadmap (`learning_content`) |
| [lessons-steps-guide.md](docs/es/data/lessons-steps-guide.md)           | Lecciones por pasos          |
| [cheatsheet.md](docs/es/setup/cheatsheet.md)                            | Referencia rápida            |

Versión en inglés: [`docs/en/`](docs/en/)

---

## Pasos para Contribuir

1. Haz fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Sube la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

---

## Contacto

Para sugerencias o para reportar errores, crea un issue en el repositorio de GitHub o de forma interna en la plataforma.

---

**Desarrollo:** Fravelz

**Licencia:** Apache License 2.0

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
