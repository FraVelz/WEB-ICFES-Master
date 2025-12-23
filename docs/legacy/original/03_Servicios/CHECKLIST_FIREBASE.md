#  CHECKLIST DE VERIFICACIÓN - Firebase Funcionando

##  Verifica esto en tu navegador

### Paso 1: Abre las DevTools
Presiona: `F12` (Windows/Linux) o `Cmd+Option+I` (Mac)

### Paso 2: Ve a la pestaña "Console"

### Paso 3: Busca los siguientes logs (deberían estar VERDES):

```
 Firebase inicializado correctamente
```

Y deberías ver:

```
 Configuración de Firebase:
- projectId: WEB-ICFES-Master
- authDomain: WEB-ICFES-Master.firebaseapp.com
```

##  Test #1: Ir a Signup

1. Ve a: `http://localhost:5173/signup`
2. Deberías ver el formulario de registro
3. Intenta crear una cuenta:
   - Email: `prueba1@test.com`
   - Contraseña: `Test123456`
   - Nombre: `Usuario Prueba`

### Si ves:
-  "Creando cuenta..." → ¡PERFECTO!
-  Redirige a `/dashboard` → ¡FUNCIONA!
-  "Email ya existe" → Usa otro email
-  Error rojo → Revisa consola (F12)

##  Test #2: Login

1. Ve a: `http://localhost:5173/login`
2. Intenta iniciar sesión con:
   - Email: `prueba1@test.com`
   - Contraseña: `Test123456`

### Si ves:
-  "Iniciando sesión..." → ¡PERFECTO!
-  Redirige a `/dashboard` → ¡FUNCIONA!
-  Tu nombre en el header → ¡EXCELENTE!

##  Test #3: Dashboard

1. Deberías estar en `/dashboard`
2. Verifica:
   -  Tu nombre aparece en el header
   -  Hay un menú desplegable al hacer clic en tu usuario
   -  El botón "Cerrar Sesión" funciona

##  Test #4: Protección de Rutas

1. Abre una pestaña anónima (sin sesión)
2. Ve a: `http://localhost:5173/dashboard`
3. Deberías ser redirigido a `/login`

### Si ves:
-  Redirige automáticamente → ¡FUNCIONA!

##  Errores Comunes y Soluciones

### Error: "Firebase configuration not found"
```
 Problema: .env.local no se cargó
 Solución: Reinicia npm run dev
```

### Error: "auth/configuration-not-found"
```
 Problema: Las credenciales están incompletas
 Solución: Verifica que ALL las variables en .env.local estén completadas
```

### Error: "CORS or network error"
```
 Problema: Problema de conexión a Firebase
 Solución: Verifica tu conexión a internet
```

### Error: "User already exists"
```
 Problema: El email ya está registrado
 Solución: Usa otro email o recupera la contraseña
```

##  Checklist Final

Marca cada uno cuando lo hayas verificado:

```
Configuración:
   npm install firebase (completado)
   .env.local existe con credenciales
   Servidor reiniciado (npm run dev)
   Caché limpio (Ctrl+Shift+R)

Firebase Console:
   Proyecto "WEB-ICFES-Master" existe
   Email/Password está HABILITADO
   Firestore Rules en "Modo prueba" (si usas Firestore)

Pruebas:
   Console (F12) muestra "Firebase inicializado"
   Puedo registrarme en /signup
   Puedo iniciar sesión en /login
   Mi nombre aparece en el header
   Cerrar sesión funciona
   /dashboard redirige a /login sin sesión

 ¡Si todo está marcado, Firebase está 100% funcionando!
```

##  Próximos Pasos (Opcional)

Ahora que Firebase funciona, puedes:

1. **Integrar con tu sistema de gamificación:**
   - Guardar XP en Firestore
   - Sincronizar datos en tiempo real

2. **Agregar login con Google:**
   - Habilitar en Firebase Console
   - Configurar OAuth

3. **Configurar Firestore:**
   - Guardar progreso de usuario
   - Sincronizar datos entre dispositivos

4. **Desplegar en producción:**
   - GitHub Pages
   - Firebase Hosting
   - Vercel

##  Tips de Depuración

Si algo no funciona:

1. **Abre la consola (F12)** y busca errores rojos
2. **Ve a Firebase Console** y revisa los logs de Authentication
3. **Verifica .env.local** está en la raíz y tiene TODAS las variables
4. **Reinicia:** npm run dev
5. **Limpia caché:** Ctrl+Shift+R

##  Contacto/Ayuda

Si necesitas ayuda:

1. Revisa el error en la consola (F12)
2. Busca el error en `FIREBASE_SOLUCION.md`
3. Verifica que Authentication está habilitado en Firebase Console
4. Intenta en una ventana anónima del navegador

---

##  ¿TODO FUNCIONA?

###  ¡Felicidades!

Tu sistema de autenticación con Firebase está **completamente funcional**.

Ahora puedes:
-  Registrar usuarios
-  Autenticar usuarios
-  Proteger rutas
-  Guardar datos en Firestore
-  Integrar con tu aplicación

**¡A programar! **
