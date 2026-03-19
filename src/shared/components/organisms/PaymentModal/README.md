# PaymentModal Component

Modal de pago factorizado y modular para la suscripción a planes.

## Estructura

```
PaymentModal/
 PaymentModal.jsx # Componente principal
 components/
 PaymentHeader.jsx # Encabezado con icono y cerrar
 BillingPeriodSelector.jsx # Selector mensual/anual
 PlanInfo.jsx # Información y precio del plan
 CardForm.jsx # Formulario de tarjeta de crédito
 SecurityNotice.jsx # Noticia de seguridad
 PaymentButtons.jsx # Botones cancelar/pagar
 SuccessMessage.jsx # Mensaje de éxito
 hooks/
 usePriceCalculation.js # Hook para cálculo de precios
 index.js # Exportación
```

## Uso

```jsx
import { PaymentModal } from '@/shared/components';

const [isOpen, setIsOpen] = useState(false);
const plan = { name: 'Pro', price: '$50' };

<PaymentModal isOpen={isOpen} onClose={() => setIsOpen(false)} plan={plan} />;
```

## Características

- Selector de período (Mensual/Anual)
- Descuento automático de 10% en planes anuales
- Validación de formulario en tiempo real
- Formato de miles con comas
- Responsive para móviles
- Contenido scrolleable con botones fijos
- Mensaje de éxito con animación

## Props

| Prop      | Tipo     | Descripción                          |
| --------- | -------- | ------------------------------------ |
| `isOpen`  | boolean  | Controla si el modal está abierto    |
| `onClose` | function | Callback para cerrar el modal        |
| `plan`    | object   | Objeto con `name` y `price` del plan |
