# StoryPagina 2.0 – Mejoras para la página de Storytellers

[![License: The Unlicense](https://img.shields.io/badge/License-Unlicense-yellow.svg)](LICENSE)  [![GitHub Repo](https://img.shields.io/badge/Repo-Storyteller--CSS-blue?logo=github)](https://github.com/T-UwU/Storyteller-CSS/tree/main)

Un proyecto que agrupa un **Userscript** y un **archivo de estilos CSS** para optimizar y personalizar la experiencia al registrar horas y navegar en la página de **Storytellers**. Con _StoryPagina 2.0_ podrás:

- Ordenar la tabla de actividades/horas.
- Mostrar el total de horas acumuladas.
- Agrupar actividades en listas colapsables por semestre.
- Filtrar registros por fecha.
- Ajustar el menú desplegable (dropdown) en base al header original.
- Aplicar estilos visuales más amigables y compactos.

---

## 📋 Tabla de Contenidos

1. [Estructura del Repositorio](#-estructura-del-repositorio)
2. [Requisitos](#-requisitos)
3. [Instalación Rápida](#-instalación-rápida)
4. [Características](#-características)
5. [Uso y Personalización](#-uso-y-personalización)
6. [Contribuciones](#-contribuciones)
7. [Licencia](#-licencia)
8. [Autor](#-autor)

---

## 📂 Estructura del Repositorio

> 📌 Mira el proyecto directamente en GitHub:  
> [https://github.com/T-UwU/Storyteller-CSS/tree/main](https://github.com/T-UwU/Storyteller-CSS/tree/main)

```text
Storyteller-CSS (root)
├── LICENSE                     # Archivo de licencia MIT
├── README.md                   # Este documento
├── storyteller.css             # Hoja de estilos principal
└── StoryPagina_2.0.js          # Userscript para Tampermonkey
````

* **`storyteller.css`**
  Hoja de estilos adicional para la página de Storytellers. Puedes cargarla con **Stylus** o **Stylish**, o bien incluir su contenido en tu propio CSS.

* **`StoryPagina_2.0.js`**
  **ÚNICAMENTE** este archivo es el que necesitas para montarlo en **Tampermonkey** (o Greasemonkey/Violentmonkey).
  Contiene el Userscript que inyecta funcionalidades y estilos dinámicos en la página de Storytellers.

---

## 📌 Requisitos

* **Navegador basado en Chromium o Firefox** (Chrome, Edge, Opera, Firefox, etc.).
* **Extensión Tampermonkey** (o Greasemonkey/Violentmonkey) instalada y habilitada.

---

## 🚀 Instalación Rápida

1. **Clona o descarga este repositorio**

   ```bash
   git clone https://github.com/T-UwU/Storyteller-CSS.git
   ```

2. **Instala el Userscript en Tampermonkey (solo necesitas el `.js`)**

   > **Importante:** Solo ocupas `StoryPagina_2.0.js` para montarlo en Tampermonkey y comenzar a usar las mejoras.

   * Abre Tampermonkey en tu navegador → “Crear un nuevo script”.
   * Copia y pega **TODO** el contenido de `StoryPagina_2.0.js`.
   * Guarda (Ctrl + S). El `@match` ya está configurado para estas páginas:
     
     ```
     https://enginyti.com/storytellers/alumno/ver_pendientes.php
     https://enginyti.com/storytellers/alumno/ver_actividades.php
     ```
   * Refresca la página de Storytellers; el script se cargará automáticamente.

---

## ✨ Características

https://github.com/user-attachments/assets/98c1f71d-5465-4706-ac18-45c105160b26

1. **Ordenar Tabla de Horas**

   * Clic en encabezados para ordenar ascendente/descendente.
   * Las filas cambian de color al alternar el orden.

2. **Totalizador de Horas**

   * Vista fija arriba de la tabla mostrando el total acumulado.
   * Se recalcula al filtrar o cambiar el rango de fechas.

3. **Listas Colapsables por Semestre**

   * Agrupa actividades según semestre o período.
   * Haz clic en el título del grupo para expandir/colapsar.

4. **Filtro por Fecha**

   * Dos inputs tipo `date` (Inicio / Fin) para delimitar el rango de actividades.
   * Solo se muestran las filas cuya fecha esté entre ambos valores.

5. **Menú Desplegable Dinámico**

   * El dropdown “Tipo de actividad” se genera desde el header original.
   * Siempre reflejará las opciones reales definidas por el servidor.

6. **Diseño y Estilos Mejorados**

   * Componentes con bordes redondeados (8 px) y sombras suaves.
   * Clases personalizadas (`.tm-ctrl`, `.tm-control-container`, etc.) para separar lógica/estilos.
   * Paleta de colores neutros y tipografía legible que reduce la fatiga visual.

---

## ⚙️ Uso y Personalización

* **Modificar Estilos (`storyteller.css`)**
  Ajusta colores, márgenes, fuentes o agrega nuevas reglas.
* **Ajustar URLs en el Userscript**
  Si cambian rutas o subdominios, edita las líneas `@match` en `StoryPagina_2.0.js`:

  ```js
  // @match https://enginyti.com/storytellers/alumno/ver_pendientes.php
  // @match https://enginyti.com/storytellers/alumno/ver_actividades.php
  ```
* **Agregar Funcionalidades**
  Dentro de `StoryPagina_2.0.js` (en el IIFE principal), crea nuevas funciones o callbacks. Respeta la estructura antes del cierre `})();`.

---

## 🤝 Contribuciones

¡Agradecemos cualquier mejora o sugerencia! Para colaborar:

1. **Forkea** este repositorio a tu cuenta de GitHub.
2. Crea una nueva rama:

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza los cambios y haz commit con mensajes claros:

   ```
   git commit -m "Agrega opción de exportar tabla a CSV"
   ```
4. Haz push a tu rama:

   ```
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **Pull Request** describiendo tu aporte.

Puedes ver los [issues abiertos](https://github.com/T-UwU/Storyteller-CSS/issues) o crear nuevos para reportar bugs y proponer mejoras.

---

## 📜 Licencia

Este proyecto está bajo la **Licencia The Unlicense**. Consulta [LICENSE](LICENSE) para más detalles.

---

## 🖊️ Autor

**Isra Sánchez**

* Storyteller, periodista en formación y desarrolladore de este Userscript.
* ✉️ [a01276695@tec.mx](mailto:a01276695@tec.mx)
* 🌐 [GitHub](https://github.com/T-UwU)

> **¡Gracias por probar StoryPagina 2.0!**
> Si encuentras algún error o tienes sugerencias, abre un issue o contáctame directamente. 😊
