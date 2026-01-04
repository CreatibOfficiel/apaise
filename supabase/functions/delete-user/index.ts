import { serve } from "https://deno.land/std@0.223.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const authHeader = req.headers.get("authorization") ?? ""
  if (!authHeader) {
    return new Response("Missing Authorization header", { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  )

  const { error } = await supabase.rpc("delete_user_account")
  if (error) {
    return new Response(error.message, { status: 400 })
  }

  return new Response(null, { status: 200 })
})
