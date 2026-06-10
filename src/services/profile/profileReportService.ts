import { supabase } from '@/config/supabase';
import {
  PROFILE_REPORT_DETAILS_MAX,
  PROFILE_REPORT_DETAILS_MIN,
  type ProfileReportReason,
} from '@/features/user/constants/profileReportReasons';

export type SubmitProfileReportInput = {
  reportedUserId: string;
  reportedUserName: string;
  profileUrl: string;
  reason: ProfileReportReason;
  details: string;
  reporterEmail?: string | null;
};

export async function submitProfileReport(
  input: SubmitProfileReportInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) {
    return { ok: false, error: 'El servicio no está disponible en este momento.' };
  }

  const session = (await supabase.auth.getSession()).data.session;
  if (!session?.user) {
    return { ok: false, error: 'Debes iniciar sesión para enviar un reporte.' };
  }

  if (session.user.id === input.reportedUserId) {
    return { ok: false, error: 'No puedes reportar tu propio perfil.' };
  }

  const details = input.details.trim();
  if (details.length < PROFILE_REPORT_DETAILS_MIN) {
    return { ok: false, error: `Describe el motivo con al menos ${PROFILE_REPORT_DETAILS_MIN} caracteres.` };
  }
  if (details.length > PROFILE_REPORT_DETAILS_MAX) {
    return { ok: false, error: `El mensaje no puede superar ${PROFILE_REPORT_DETAILS_MAX} caracteres.` };
  }

  const { error } = await supabase.from('profile_reports').insert({
    reported_user_id: input.reportedUserId,
    reporter_id: session.user.id,
    reason: input.reason,
    details,
    profile_url: input.profileUrl,
    reported_display_name: input.reportedUserName,
    reporter_email: input.reporterEmail ?? session.user.email ?? null,
  });

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'Ya tienes un reporte pendiente sobre este perfil.' };
    }
    console.error('profile report insert:', error);
    return { ok: false, error: 'No se pudo enviar el reporte. Intenta de nuevo más tarde.' };
  }

  return { ok: true };
}
