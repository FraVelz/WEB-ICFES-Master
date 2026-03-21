/**
 * Función de debugging para verificar qué está en localStorage
 * Ejecuta esto en la consola del navegador (F12) para diagnosticar problemas
 */

export const debugLocalStorage = () => {
  console.log('=== DEBUGGING LOCALSTORAGE ===\n');

  // Verificar exámenes
  const exams = localStorage.getItem('icfes_exams');
  console.log('📋 Exámenes guardados:');
  if (exams) {
    const parsedExams = JSON.parse(exams);
    console.log(`✅ ${parsedExams.length} exámenes encontrados`);
    console.table(parsedExams);
  } else {
    console.log('❌ No hay exámenes guardados');
  }

  // Verificar prácticas
  const practices = localStorage.getItem('icfes_practice');
  console.log('\n📚 Prácticas guardadas:');
  if (practices) {
    const parsedPractices = JSON.parse(practices);
    console.log(`✅ ${parsedPractices.length} prácticas encontradas`);
    console.table(parsedPractices);
  } else {
    console.log('❌ No hay prácticas guardadas');
  }

  // Verificar progreso
  const progress = localStorage.getItem('icfes_progress');
  console.log('\n📊 Progreso consolidado:');
  if (progress) {
    const parsedProgress = JSON.parse(progress);
    console.log('✅ Progreso encontrado');
    console.log('Detalles:', parsedProgress);
  } else {
    console.log('❌ No hay progreso consolidado');
  }

  // Verificar perfil
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
 * Limpia todos los datos de localStorage (CUIDADO: esto elimina TODO)
 */
export const clearAllDataDebug = () => {
  if (
    confirm('⚠️  ADVERTENCIA: Esto eliminará TODOS los datos. ¿Estás seguro?')
  ) {
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
 * Limpia solo las estadísticas (útil para probar de nuevo)
 */
export const clearStats = () => {
  localStorage.removeItem('icfes_exams');
  localStorage.removeItem('icfes_practice');
  localStorage.removeItem('icfes_progress');
  console.log('✅ Estadísticas eliminadas');
};

/**
 * Verifica si los datos están siendo guardados correctamente
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
