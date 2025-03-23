import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { genCondition } from "@/utils/genCondition";
import { Database } from "@/utils/database.types";
import { SERVER_ERR_MSG } from "@/utils/messages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesBrowserClient<Database>();
  try {
    let { data, error, status } = req.body.filter.length === 0 
      ? await supabase
        .from("profiles")
        .select(`uid, name, gender, birthday, users!inner(email, phone_number, selfie, is_verified)`)
        .range(req.body.range.start, req.body.range.end)
        .not('users.selfie', 'is', null)
      : await supabase
        .from("profiles")
        .select(`uid, name, gender, birthday, users!inner (is_premium, report_status, email, phone_number, selfie, is_verified)`)
        .in('users.is_premium', genCondition('type', req.body.filter.type))
        .in('users.report_status', genCondition('status', req.body.filter.status))
        .in('users.is_verified', genCondition('is_verified', req.body.filter.is_verified))
        .in('gender', genCondition('gender', req.body.filter.gender))
        .range(req.body.range.start, req.body.range.end)
        .not('users.selfie', 'is', null)

    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      res.status(200).json({ data });
    }
  } catch (error) {
    res.status(500).json({ data: SERVER_ERR_MSG });
  }
}
