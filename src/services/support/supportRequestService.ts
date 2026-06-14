import { supabase } from '@/config/supabase';
import {
  SUPPORT_MESSAGE_MAX,
  SUPPORT_MESSAGE_MIN,
  type SupportCategory,
  type SupportKind,
} from '@/features/user/constants/supportRequestConstants';

export type SubmitSupportRequestInput = {
  kind: SupportKind;
  category: SupportCategory;
  message: string;
  contactEmail?: string | null;
  pageUrl?: string | null;
  userAgent?: string | null;
};

export async function submitSupportRequest(
  input: SubmitSupportRequestInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) {
    return { ok: false, error: 'El servicio no está disponible en este momento.' };
  }

  const session = (await supabase.auth.getSession()).data.session;
  if (!session?.user) {
    return { ok: false, error: 'Debes iniciar sesión para enviar un mensaje.' };
  }

  const message = input.message.trim();
  if (message.length < SUPPORT_MESSAGE_MIN) {
    return { ok: false, error: `Describe tu mensaje con al menos ${SUPPORT_MESSAGE_MIN} caracteres.` };
  }
  if (message.length > SUPPORT_MESSAGE_MAX) {
    return { ok: false, error: `El mensaje no puede superar ${SUPPORT_MESSAGE_MAX} caracteres.` };
  }

  if (input.kind === 'contact') {
    const email = input.contactEmail?.trim();
    if (!email) {
      return { ok: false, error: 'Ingresa un correo para responderte.' };
    }
  }

  const { error } = await supabase.from('support_requests').insert({
    user_id: session.user.id,
    kind: input.kind,
    category: input.category,
    message,
    contact_email: input.contactEmail?.trim() || session.user.email || null,
    page_url: input.pageUrl?.trim() || null,
    user_agent: input.userAgent?.trim() || null,
  });

  if (error) {
    console.error('support request insert:', error);
    return { ok: false, error: 'No se pudo enviar tu mensaje. Intenta de nuevo más tarde.' };
  }

  return { ok: true };
}
