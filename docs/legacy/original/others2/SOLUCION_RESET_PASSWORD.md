# Solución: Restablecimiento de Contraseña Personalizado

## El Problema

Firebase por defecto envía emails con enlaces que apuntan a `firebaseapp.com`, que muestra la plantilla genérica de Firebase.

## La Solución

He implementado una solución en **3 partes**:

### 1. ✅ Código Actualizado (Ya hecho)

**Archivo: `AuthContext.jsx`**
- Configurado `handleCodeInApp: true` para que Firebase maneje el código en la app
- La URL de continuar apunta a tu `/reset-password`

**Archivo: `ResetPasswordPage.jsx`**
- Ahora busca el código en parámetros de URL
- Soporta tanto hash como query parameters
- Verifica que el código sea válido antes de permitir el cambio

**Archivo: `index.html`**
- Agregué un script que intercepta enlaces de Firebase
- Si llega un enlace con `mode=resetPassword`, lo redirige a tu página

---

## 2. 🔧 Configuración Necesaria en Firebase Console

Sigue estos pasos **EXACTAMENTE** para que funcione:

### Paso 1: Autorizar tu Dominio
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** (Autenticación)
4. Haz clic en la pestaña **Settings** (Configuración)
5. Busca la sección **Authorized domains** (Dominios autorizados)
6. Agrega:
   - Para desarrollo: `localhost:5173`
   - Para producción: tu dominio (ej: `miapp.com`)

### Paso 2: Configurar el Custom Domain (Opcional pero recomendado)
Si tienes un dominio personalizado:
1. En **Settings**, sección **Custom domain** 
2. Configura tu dominio personalizado
3. Esto hará que los emails apunten a `tu-dominio.com/__/auth/action` en lugar de `firebaseapp.com/__/auth/action`

---

## 3. 🧪 Prueba

### Opción A: Prueba Local (Recomendado primero)

1. **Reinicia tu servidor**
   ```bash
   pnpm dev
   ```

2. **Ve a**: `http://localhost:5173/forgot-password`

3. **Ingresa un email registrado**

4. **Revisa tu email** (incluyendo carpeta de spam)

5. **Haz clic en el enlace**

6. **Esperado**: Deberías ir a tu página personalizada de reset

### Opción B: Simular el Enlace
Si no recibiste el email, puedes simular el flujo:

1. En la consola del navegador (F12), ejecuta:
   ```javascript
   // Ir directamente a reset-password (necesitas un código válido)
   window.location.href = '/reset-password?oobCode=CODIGO_AQUI'
   ```

---

## 📋 Cambios Realizados

### 1. **AuthContext.jsx**
```javascript
const actionCodeSettings = {
  url: `${window.location.origin}/reset-password`,
  handleCodeInApp: true, // ← IMPORTANTE
};
await sendPasswordResetEmail(auth, email, actionCodeSettings);
```

### 2. **ResetPasswordPage.jsx**
- Ahora busca código en `?oobCode=` parámetro
- Soporta hash parameters también
- Mejor manejo de errores

### 3. **index.html**
- Script que intercepta enlaces de Firebase
- Redirige a tu página personalizada

---

## ⚠️ Nota Importante

El parámetro `handleCodeInApp: true` es clave. Esto le dice a Firebase que:
- **NO** use su plantilla predeterminada
- **SÍ** incluya el código en la URL
- **SÍ** apunte a tu URL (`/reset-password`)

---

## 🆘 Si Aún No Funciona

### Checklist:

- [ ] ¿Reiniciaste el servidor de desarrollo? (`Ctrl+C` y `pnpm dev`)
- [ ] ¿Agregaste `localhost:5173` a dominios autorizados en Firebase?
- [ ] ¿Limpiaste el caché del navegador? (Ctrl+Shift+Del)
- [ ] ¿Solicitaste un NUEVO email después de hacer estos cambios?
- [ ] ¿El email llegó a spam?

### Debugging:

1. **Abre DevTools** (F12)
2. **Console** (Consola)
3. **Ve a `http://localhost:5173/forgot-password`**
4. **Ingresa un email**
5. **Revisa la consola** por errores de Firebase
6. **Mira el email** que recibas

---

## 📧 Qué debería decir el Email

El email debería decir algo como:

"Para restablecer tu contraseña, haz clic en el siguiente enlace:"

Y el enlace debería parecer:
```
http://localhost:5173/__/auth/action?mode=resetPassword&oobCode=...&apiKey=...&continueUrl=http%3A%2F%2Flocalhost%3A5173%2Freset-password
```

O si configuraste dominios autorizados correctamente:
```
http://localhost:5173/reset-password?oobCode=...
```

---

## 🎯 Resumen

1. ✅ Código actualizado en tu app
2. 🔧 Necesitas autorizar `localhost:5173` en Firebase Console
3. 🧪 Prueba y dime si funciona
