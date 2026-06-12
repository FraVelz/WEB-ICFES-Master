-- league_rank_config: lectura para usuarios autenticados (catálogo de ligas)
CREATE POLICY league_rank_config_select_authenticated
  ON public.league_rank_config
  FOR SELECT
  TO authenticated
  USING (true);

-- RPC de mantenimiento: solo service_role (revocar anon y authenticated)
REVOKE EXECUTE ON FUNCTION public.backfill_league_groups() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_weekly_leagues() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.migrate_legacy_user_ids_to_auth_uuid() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.diagnose_legacy_user_ids() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.backfill_league_groups() TO service_role;
GRANT EXECUTE ON FUNCTION public.process_weekly_leagues() TO service_role;
GRANT EXECUTE ON FUNCTION public.migrate_legacy_user_ids_to_auth_uuid() TO service_role;
GRANT EXECUTE ON FUNCTION public.diagnose_legacy_user_ids() TO service_role;

-- add_weekly_xp no debe ser invocable sin sesión
REVOKE EXECUTE ON FUNCTION public.add_weekly_xp(uuid, integer) FROM anon;
