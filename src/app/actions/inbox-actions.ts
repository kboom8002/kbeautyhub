'use server';

import { createAdminClient } from "@/lib/supabase";

export async function fetchUnsortedInbox() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('raw_intake_question')
    .select('*')
    .eq('status', 'UNSORTED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("fetchUnsortedInbox Error:", error);
    return [];
  }
  return data || [];
}

export async function insertRawQuestion(text: string, source: string, count: number = 1) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('raw_intake_question')
    .insert([{ text, source, count, status: 'UNSORTED' }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function bulkInsertRawQuestions(rows: {text: string, source: string, count: number}[]) {
  const supabase = createAdminClient();
  const payloads = rows.map(r => ({ ...r, status: 'UNSORTED' }));
  const { data, error } = await supabase
    .from('raw_intake_question')
    .insert(payloads)
    .select();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function markRawQuestionsAsClustered(ids: string[]) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('raw_intake_question')
    .update({ status: 'CLUSTERED' })
    .in('id', ids);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
