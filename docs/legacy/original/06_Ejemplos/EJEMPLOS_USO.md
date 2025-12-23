#  Ejemplos de Uso - Sistema de Almacenamiento de Progreso

##  Ejemplos Rápidos

### Ejemplo 1: Verificar datos después de un examen
```javascript
// En la consola después de completar FullExamPage

// Ver exámenes guardados
const exams = JSON.parse(localStorage.getItem('icfes_exams'));
console.log('Exámenes:', exams);
console.log('Total de exámenes:', exams.length);
console.log('Último examen:', exams[exams.length - 1]);

// Ver progreso actual
const progress = JSON.parse(localStorage.getItem('icfes_progress'));
console.log('Porcentaje:', progress.percentage + '%');
console.log('Racha de días:', progress.streakDays);
console.log('Mejor área:', progress.bestArea.name);
console.log('Peor área:', progress.weakArea.name);
```

### Ejemplo 2: Monitorear cambios en tiempo real
```javascript
// Ver cómo cambian los datos conforme practicas

// Antes de practicar
const antes = JSON.parse(localStorage.getItem('icfes_progress'));
console.log('ANTES:', {
  totalAttempts: antes.totalAttempts,
  percentage: antes.percentage,
  matemáticas: antes.areaStats.matematicas.percentage
});

// Después de practicar Matemáticas
// (vuelve a ejecutar después de completar la práctica)
const despues = JSON.parse(localStorage.getItem('icfes_progress'));
console.log('DESPUÉS:', {
  totalAttempts: despues.totalAttempts,
  percentage: despues.percentage,
  matemáticas: despues.areaStats.matematicas.percentage
});
```

### Ejemplo 3: Ver todas las recomendaciones
```javascript
// Simular la generación de recomendaciones
import { getProgress, getRecommendations } from './src/utils/progressStorage';

const progress = getProgress();
const recs = getRecommendations(progress);

recs.forEach((rec, idx) => {
  console.log(`${idx + 1}. ${rec}`);
});
```

---

##  Casos de Uso Prácticos

### Caso 1: Usuario completa primer examen
```javascript
// Usuario completa FullExamPage: 45/50 (90%)

// localStorage['icfes_exams'] contiene:
[
  {
    id: 1702346000000,
    type: 'full-exam',
    date: '2024-12-11T15:30:00.000Z',
    examType: 'full-exam',
    questions: [...],         // 50 preguntas
    answers: {...},           // 50 respuestas
    correctCount: 45,
    percentage: 90,
    totalQuestions: 50,
    config: {
      numQuestions: 50,
      useTimer: true,
      timePerQuestion: 3,
      showExplanations: true
    }
  }
]

// localStorage['icfes_progress'] contiene:
{
  totalAttempts: 1,
  totalQuestions: 50,
  totalCorrect: 45,
  percentage: 90,
  streakDays: 1,
  lastAttemptDate: '2024-12-11T15:30:00.000Z',
  bestArea: {
    name: 'Matemáticas',
    correct: 15,
    total: 15,
    percentage: 100,
    ...
  },
  weakArea: {
    name: 'Ciencias Naturales',
    correct: 8,
    total: 12,
    percentage: 67,
    ...
  },
  areaStats: {
    matematicas: { correct: 15, total: 15, percentage: 100, ... },
    lenguaje: { correct: 12, total: 13, percentage: 92, ... },
    ciencias: { correct: 8, total: 12, percentage: 67, ... },
    sociales: { correct: 10, total: 10, percentage: 100, ... }
  }
}

// ProgressPage muestra:
//  Desempeño General: 90%
//  Racha de Estudio: 1 día
//  Mejor Área: Matemáticas (100%)
//  Área Débil: Ciencias Naturales (67%)
//  Recomendaciones: Enfócate en Ciencias...
```

### Caso 2: Usuario realiza práctica después de examen
```javascript
// Usuario completa PracticePage de Matemáticas: 8/10 (80%)

// localStorage['icfes_practice'] ahora contiene:
[
  {
    id: 1702346060000,
    type: 'practice',
    date: '2024-12-11T15:31:00.000Z',
    practiceArea: 'matematicas',
    areaName: 'Matemáticas',
    questions: [...],         // 10 preguntas
    answers: {...},           // 10 respuestas
    correctCount: 8,
    percentage: 80,
    totalQuestions: 10,
    config: { ... }
  }
]

// localStorage['icfes_progress'] se actualiza automáticamente:
{
  totalAttempts: 2,           // Ahora hay 2 intentos
  totalQuestions: 60,         // Total: 50 + 10
  totalCorrect: 53,           // Total: 45 + 8
  percentage: 88,             // Promedio: (45+8)/(50+10)
  streakDays: 1,              // Mismo día
  areaStats: {
    matematicas: {
      correct: 23,            // Actualizado: 15 + 8
      total: 25,              // Actualizado: 15 + 10
      percentage: 92,         // Recalculado
      ...
    },
    // Otros permanecen igual
  }
}

// ProgressPage se actualiza automáticamente:
//  Desempeño General: 88%
//  Racha de Estudio: 1 día
//  Mejor Área: Matemáticas (92%)
//  Área Débil: Ciencias Naturales (67%)
```

### Caso 3: Usuario estudia dos días consecutivos
```javascript
// Día 1: Realiza examen
// streakDays = 1

// Día 2: Realiza otra práctica
// streakDays = 2 (días consecutivos)

// Día 3: No estudia
// streakDays se mantendrá en 2 hasta el día 4

// Día 4: Estudia de nuevo
// streakDays se reinicia a 1 (porque faltó un día)
```

### Caso 4: Sistema identifica área débil
```javascript
// Después de múltiples intentos:

{
  areaStats: {
    matematicas: { percentage: 95 },    // Muy bueno
    lenguaje: { percentage: 88 },       // Bueno
    ciencias: { percentage: 60 },       // DÉBIL
    sociales: { percentage: 85 }        // Bueno
  }
}

// ProgressPage muestra:
// bestArea: Matemáticas (95%)
// weakArea: Ciencias Naturales (60%)

// getRecommendations() genera:
// "Enfócata en fortalecer Ciencias Naturales para mejorar tu promedio"
```

---

##  Debugging y Troubleshooting

### Debug 1: Ver formato exacto de datos
```javascript
// Obtener datos sin procesar
const rawExams = localStorage.getItem('icfes_exams');
console.log('Raw:', rawExams);  // String JSON

// Obtener datos parseados
const parsedExams = JSON.parse(rawExams);
console.log('Parsed:', parsedExams);  // Objeto

// Ver tamaño de datos
const sizeInBytes = new Blob([rawExams]).size;
console.log('Size:', sizeInBytes, 'bytes');
console.log('Size:', (sizeInBytes / 1024).toFixed(2), 'KB');
```

### Debug 2: Verificar si todo funciona
```javascript
// Función de validación
function verificarSistema() {
  console.log('=== VERIFICACIÓN DEL SISTEMA ===');
  
  // 1. localStorage disponible
  const storageDisponible = typeof Storage !== 'undefined';
  console.log(' localStorage disponible:', storageDisponible);
  
  // 2. Datos de exámenes
  const exams = JSON.parse(localStorage.getItem('icfes_exams')  '[]');
  console.log(' Exámenes guardados:', exams.length);
  
  // 3. Datos de prácticas
  const practices = JSON.parse(localStorage.getItem('icfes_practice')  '[]');
  console.log(' Prácticas guardadas:', practices.length);
  
  // 4. Progreso consolidado
  const progress = JSON.parse(localStorage.getItem('icfes_progress')  'null');
  console.log(' Progreso guardado:', progress !== null);
  
  if (progress) {
    console.log('   - Porcentaje:', progress.percentage + '%');
    console.log('   - Racha:', progress.streakDays, 'días');
    console.log('   - Mejor área:', progress.bestArea?.name  'N/A');
    console.log('   - Peor área:', progress.weakArea?.name  'N/A');
  }
  
  return storageDisponible && exams.length > 0 && progress !== null;
}

// Ejecutar verificación
verificarSistema();
```

### Debug 3: Recuperarse de errores
```javascript
// Si algo sale mal, resetea con cuidado
function resetearParcial() {
  // Opción 1: Resetear solo el progreso (pero mantener datos de exámenes)
  localStorage.removeItem('icfes_progress');
  console.log('Progreso reseteado, los exámenes se mantienen');
  
  // Opción 2: Actualizar el progreso manualmente
  import { updateProgress } from './src/utils/progressStorage';
  updateProgress();
  console.log('Progreso recalculado');
}

// Total reset (ADVERTENCIA: borra TODO)
function resetearCompletamente() {
  const confirm = window.confirm(
    '¿Estás seguro? Esto borrará todos tus datos.'
  );
  
  if (confirm) {
    localStorage.clear();
    console.log('Todos los datos han sido eliminados');
  }
}
```

---

##  Monitoreo de Progreso

### Script para ver evolución
```javascript
// Ejecutar esto múltiples veces a lo largo del día

function monitorearProgreso() {
  const progress = JSON.parse(localStorage.getItem('icfes_progress'));
  
  if (!progress) {
    console.log('No hay datos de progreso aún');
    return;
  }
  
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(`[${timestamp}] Estado actual:`);
  console.log(` Total de intentos: ${progress.totalAttempts}`);
  console.log(` Desempeño: ${progress.percentage}%`);
  console.log(` Racha: ${progress.streakDays} días`);
  console.log(` Total de preguntas: ${progress.totalQuestions}`);
  console.log(` Respuestas correctas: ${progress.totalCorrect}`);
  console.log(` Mejor área: ${progress.bestArea?.name} (${progress.bestArea?.percentage}%)`);
  console.log(` Peor área: ${progress.weakArea?.name} (${progress.weakArea?.percentage}%)`);
}

// O crear un monitor en tiempo real
setInterval(monitorearProgreso, 5000);  // Cada 5 segundos
```

### Script para ver cambios
```javascript
// Comparar estado anterior y actual

let estadoAnterior = null;

function detectarCambios() {
  const estadoActual = JSON.parse(
    localStorage.getItem('icfes_progress')
  );
  
  if (!estadoAnterior) {
    estadoAnterior = estadoActual;
    return;
  }
  
  if (estadoActual.percentage !== estadoAnterior.percentage) {
    console.log(
      ` Porcentaje cambió: ${estadoAnterior.percentage}% → ${estadoActual.percentage}%`
    );
  }
  
  if (estadoActual.streakDays !== estadoAnterior.streakDays) {
    console.log(
      ` Racha cambió: ${estadoAnterior.streakDays} → ${estadoActual.streakDays} días`
    );
  }
  
  if (estadoActual.totalAttempts !== estadoAnterior.totalAttempts) {
    console.log(
      ` Intentos: ${estadoAnterior.totalAttempts} → ${estadoActual.totalAttempts}`
    );
  }
  
  estadoAnterior = estadoActual;
}

// Monitorear cambios cada segundo
setInterval(detectarCambios, 1000);
```

---

##  Casos de Aprendizaje

### Aprender: Cómo funciona updateProgress
```javascript
// Este código se ejecuta INTERNAMENTE cada vez que guardas

function entenderUpdateProgress() {
  // 1. Lee todos los exámenes y prácticas
  const exams = JSON.parse(localStorage.getItem('icfes_exams')  '[]');
  const practices = JSON.parse(localStorage.getItem('icfes_practice')  '[]');
  
  // 2. Combina todos los intentos
  const todosLosIntentos = [...exams, ...practices];
  
  // 3. Itera sobre todas las preguntas
  let totalPreguntas = 0;
  let totalCorrectas = 0;
  
  todosLosIntentos.forEach(intento => {
    totalPreguntas += intento.totalQuestions;
    totalCorrectas += intento.correctCount;
  });
  
  // 4. Calcula porcentaje
  const porcentaje = (totalCorrectas / totalPreguntas) * 100;
  
  // 5. Así se obtiene el porcentaje final en ProgressPage
  console.log(`Porcentaje: ${porcentaje.toFixed(0)}%`);
}
```

### Aprender: Cómo funciona calculateStreak
```javascript
// Este código calcula la racha de días

function entenderCalculoRacha() {
  const todosLosIntentos = [
    { date: '2024-12-11T10:00:00Z' },  // Día 11
    { date: '2024-12-11T15:30:00Z' },  // Día 11 (mismo día)
    { date: '2024-12-12T09:00:00Z' },  // Día 12 (consecutivo)
    { date: '2024-12-13T14:00:00Z' },  // Día 13 (consecutivo)
    // Falta el día 14
    { date: '2024-12-15T10:00:00Z' }   // Día 15 (racha se reinicia)
  ];
  
  // Extraer fechas únicas
  const fechasUnicas = [
    ...new Set(
      todosLosIntentos.map(i => new Date(i.date).toDateString())
    )
  ].sort((a, b) => new Date(b) - new Date(a));
  
  // fechasUnicas = ['Sun Dec 15 2024', 'Wed Dec 13 2024', 'Tue Dec 12 2024', 'Mon Dec 11 2024']
  
  // Contar consecutivas desde hoy/ayer
  let racha = 1;
  for (let i = 1; i < fechasUnicas.length; i++) {
    const prevDate = new Date(fechasUnicas[i]);
    const expectedDate = new Date(fechasUnicas[i - 1]);
    expectedDate.setDate(expectedDate.getDate() - 1);
    
    if (prevDate.toDateString() === expectedDate.toDateString()) {
      racha++;
    } else {
      break;  // Racha se rompe
    }
  }
  
  // racha = 2 (porque el 15 está desconectado del 13)
  console.log('Racha de días:', racha);
}
```

---

##  Casos Avanzados

### Exportar datos a JSON
```javascript
function exportarDatos() {
  const datos = {
    exams: JSON.parse(localStorage.getItem('icfes_exams')  '[]'),
    practices: JSON.parse(localStorage.getItem('icfes_practice')  '[]'),
    progress: JSON.parse(localStorage.getItem('icfes_progress')  'null'),
    exportedAt: new Date().toISOString()
  };
  
  const json = JSON.stringify(datos, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `progreso-${new Date().toISOString()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

### Importar datos desde JSON
```javascript
function importarDatos(jsonFile) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const datos = JSON.parse(e.target.result);
      
      localStorage.setItem('icfes_exams', JSON.stringify(datos.exams));
      localStorage.setItem('icfes_practice', JSON.stringify(datos.practices));
      localStorage.setItem('icfes_progress', JSON.stringify(datos.progress));
      
      console.log('Datos importados exitosamente');
      location.reload();
    } catch (error) {
      console.error('Error al importar:', error);
    }
  };
  
  reader.readAsText(jsonFile);
}
```

---

Estos ejemplos te mostran cómo usar y entender el sistema completamente. ¡Prueba ejecutar estos códigos en la consola!
