# Configuración de Restablecimiento de Contraseña Personalizado

## ✅ Cambios Realizados

Se ha modificado el proceso de restablecimiento de contraseña para usar tu página personalizada en lugar de la plantilla genérica de Firebase.

### Archivo Modificado: `AuthContext.jsx`

La función `resetPassword` ahora incluye `ActionCodeSettings` que especifica que los enlaces de recuperación deben dirigir a tu página personalizada:

```javascript
const resetPassword = async (email) => {
  try {
    setError(null);
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return true;
  } catch (err) {
    const errorMessage = getErrorMessage(err.code);
    setError(errorMessage);
    throw err;
  }
};
```

## 🔧 Pasos de Configuración en Firebase Console

Para que funcione correctamente, debes autorizar tu dominio en Firebase:

### 1. Accede a Firebase Console
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Selecciona tu proyecto

### 2. Configura el Dominio Autorizado
- Dirígete a **Authentication** > **Settings** (Configuración)
- En la sección **Authorized domains** (Dominios autorizados), verifica que tu dominio esté listado:
  - Para desarrollo local: `localhost:5173` (o el puerto que uses)
  - Para producción: tu dominio (ej: `miapp.com`)

### 3. Configura la URL de Callback (Importante)
- En la misma página de **Settings**, busca **Authorized redirect URIs** (si aplica)
- Asegúrate de que tu URL de restablecimiento esté autorizada

## 🔍 Cómo Funciona Ahora

1. **Usuario solicita recuperación**: Hace clic en "¿Olvidaste tu contraseña?" en el login
2. **Ingresa su email**: Se verifica que exista en la base de datos
3. **Recibe email**: Firebase envía un email con un enlace personalizado a tu página
4. **Enlace va a tu página**: El usuario es dirigido a `/reset-password` (tu página personalizada)
5. **Restablece contraseña**: Tu página muestra el formulario personalizado con validaciones
6. **Redirección**: Después de completar, automáticamente se redirige al login después de 3 segundos

## ✨ Características de tu Página Personalizada

- ✅ Validación de contraseña (mínimo 6 caracteres, mayúscula, número)
- ✅ Visualización de requisitos en tiempo real
- ✅ Mostrar/ocultar contraseña
- ✅ Mensajes de error descriptivos
- ✅ Verificación del código de recuperación
- ✅ Redirección automática al login
- ✅ Diseño consistente con tu aplicación (tema oscuro, gradientes)

## 🧪 Prueba Local

1. En desarrollo local, abre `http://localhost:5173`
2. Ve a "/forgot-password"
3. Ingresa un email registrado
4. Verifica que recibas un email (revisá spam)
5. Haz clic en el enlace del email
6. Deberías ir a tu página personalizada de reset, no a la de Firebase
7. Restablece tu contraseña
8. Automáticamente serás redirigido al login

## ⚠️ Notas Importantes

- El dominio `localhost:5173` ya debería estar autorizado automáticamente
- Si cambias el puerto de Vite, debes actualizar el dominio autorizado
- La URL debe ser HTTPS en producción (Firebase requiere HTTPS excepto para localhost)
- El email de recuperación se valida para asegurar que el usuario exista

## 🆘 Solución de Problemas

Si aún ves la plantilla de Firebase:

1. **Limpia el caché del navegador** (Ctrl+Shift+Del o Cmd+Shift+Del)
2. **Verifica que el dominio esté autorizado** en Firebase Console
3. **Recarga la página** completamente
4. **Solicita un nuevo email** de recuperación

Si los enlaces siguen siendo genéricos:

1. Asegúrate de que la modificación en `AuthContext.jsx` esté en el archivo
2. Recarga tu servidor de desarrollo (`npm run dev` o `pnpm dev`)
3. Solicita un nuevo email de recuperación
