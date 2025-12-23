# Hoja de Referencia Rápida (Cheatsheet)

## Comandos de Terminal (CLI)

### Desarrollo Diario
| Acción | Comando |
|--------|---------|
| Iniciar servidor local | `npm run dev` |
| Compilar proyecto | `npm run build` |
| Sincronizar Android | `npx cap sync` |
| Abrir Android Studio | `npx cap open android` |

### Firebase
| Acción | Comando |
|--------|---------|
| Deploy completo | `firebase deploy` |
| Deploy solo hosting | `firebase deploy --only hosting` |
| Emulador local | `firebase emulators:start` |

### Builds Android
```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release Bundle (.aab)
cd android && ./gradlew bundleRelease
```

---

## Snippets de Código (Frontend)

### Uso de Servicios

**UserService**
```javascript
import { UserService } from '@/services';

// Obtener perfil
const user = await UserService.getUserProfile();

// Actualizar datos
await UserService.updateProfile(userId, { username: 'Nuevo' });
```

**ProgressService**
```javascript
import { ProgressService } from '@/services';

// Registrar respuesta
await ProgressService.updateAfterAnswer(userId, {
  isCorrect: true,
  area: 'Matemáticas',
  difficulty: 'media'
});
```

### Hooks Comunes

**useQuizLogic**
```javascript
import { useQuizLogic } from '@/hooks/useQuizLogic';

const { 
  currentQuestion, 
  handleAnswer, 
  isFinished 
} = useQuizLogic(questions);
```
