# Privacidad — export resultados y borrado de cuenta (B2-5)

## Export resultados

**UI:** Ajustes → Gestión de Cuenta → **Exportar mis resultados**.

Descarga JSON (`icfes-master-resultados-YYYY-MM-DD.json`) con:

- `progress` agregado local
- `practices` / `exams` (intentos en `localStorage`)

Código: `src/features/user/utils/exportUserResults.ts`.

No incluye email ni tokens. Si el usuario tiene sync Supabase, el JSON refleja lo que está en el cliente en ese momento (historial local + progreso calculado).

---

## Path borrado (PII)

| Acción UI | Confirmación | Efecto |
|-----------|--------------|--------|
| Borrar mis Datos | `BORRAR TODO` | `resetProgress` + `resetUserExams` (borra `exam_results` del user en Supabase si hay sesión) + `clearLocalClientData` |
| Eliminar Cuenta | `BORRAR MI CUENTA` | Lo anterior + `logout`. **Auth user en Supabase Auth no se auto-borra** (sin service role en cliente) |

### Honestidad

Para borrar la fila en Auth (`auth.users`) hace falta:

1. Soporte in-app (categoría cuenta) **o**
2. Admin con service role / Dashboard Supabase Authentication → Delete user

Documentado en el toast post-borrado cuando Supabase está configurado.

### Checklist verificación

1. Export → archivo abre como JSON válido.
2. Borrar datos → progreso/exámenes locales vacíos; `exam_results` del uid ausentes.
3. Eliminar cuenta → sesión cerrada + datos locales limpios; cuenta Auth pendiente de soporte si aplica.

---

## Relacionado

- `src/features/user/hooks/useUserSettingsAccountHandlers.ts`
- `src/services/persistence/clearLocalClientData.ts`
- `ExamSupabaseService.resetUserExams`
