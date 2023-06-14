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
        .from("users")
        .select(`uid, profiles (name, gender, birthday)`)
        .range(req.body.range.start, req.body.range.end)
      : await supabase
        .from("users")
        .select(`uid, profiles (name, gender, birthday)`)
        .filter('is_premium', 'in', genCondition('type', req.body.filter.type))
        .filter('report_status', 'in', genCondition('status', req.body.filter.status))
        .filter('profiles.gender', 'in', genCondition('gender', req.body.filter.gender))
        .range(req.body.range.start, req.body.range.end)

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
