/**
 * Debug helpers to inspect localStorage
 * Run from the browser console (F12) when diagnosing issues
 */

export const debugLocalStorage = () => {
  console.log('=== DEBUGGING LOCALSTORAGE ===\n');

  // Exams
  const exams = localStorage.getItem('icfes_exams');
  console.log('📋 Exámenes guardados:');
  if (exams) {
    const parsedExams = JSON.parse(exams);
    console.log(`✅ ${parsedExams.length} exámenes encontrados`);
    console.table(parsedExams);
  } else {
    console.log('❌ No hay exámenes guardados');
  }

  // Practice attempts
  const practices = localStorage.getItem('icfes_practice');
  console.log('\n📚 Prácticas guardadas:');
  if (practices) {
    const parsedPractices = JSON.parse(practices);
    console.log(`✅ ${parsedPractices.length} prácticas encontradas`);
    console.table(parsedPractices);
  } else {
    console.log('❌ No hay prácticas guardadas');
  }

  // Progress
  const progress = localStorage.getItem('icfes_progress');
  console.log('\n📊 Progreso consolidado:');
  if (progress) {
    const parsedProgress = JSON.parse(progress);
    console.log('✅ Progreso encontrado');
    console.log('Detalles:', parsedProgress);
  } else {
    console.log('❌ No hay progreso consolidado');
  }

  // Profile
  const profile = localStorage.getItem('icfes_user_profile');
  console.log('\n👤 Perfil de usuario:');
  if (profile) {
    const parsedProfile = JSON.parse(profile);
    console.log('✅ Perfil encontrado');
    console.log('Usuario:', parsedProfile.username);
  } else {
    console.log('❌ No hay perfil de usuario');
  }

  console.log('\n=== FIN DEL DEBUG ===');
};

/**
 * Clear all tracked localStorage keys (destructive)
 */
export const clearAllDataDebug = () => {
  if (confirm('⚠️  ADVERTENCIA: Esto eliminará TODOS los datos. ¿Estás seguro?')) {
    localStorage.removeItem('icfes_exams');
    localStorage.removeItem('icfes_practice');
    localStorage.removeItem('icfes_progress');
    localStorage.removeItem('icfes_user_profile');
    localStorage.removeItem('icfes_user_settings');
    console.log('✅ Todos los datos han sido eliminados');
    window.location.reload();
  }
};

/**
 * Clear stats keys only (exams, practice, progress)
 */
export const clearStats = () => {
  localStorage.removeItem('icfes_exams');
  localStorage.removeItem('icfes_practice');
  localStorage.removeItem('icfes_progress');
  console.log('✅ Estadísticas eliminadas');
};

/**
 * Smoke test: can we round-trip a value in localStorage?
 */
export const testSaveAndLoad = () => {
  const testData = {
    test: true,
    timestamp: new Date().toISOString(),
    data: 'prueba de guardado',
  };

  console.log('📝 Guardando datos de prueba...');
  localStorage.setItem('test_data', JSON.stringify(testData));

  const loaded = localStorage.getItem('test_data');
  if (loaded) {
    const parsedData = JSON.parse(loaded);
    console.log('✅ Datos guardados y cargados correctamente');
    console.log(parsedData);
    localStorage.removeItem('test_data');
  } else {
    console.log('❌ Error: No se pueden guardar datos en localStorage');
  }
};
