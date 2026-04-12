import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!SUPABASE_KEY || !GOOGLE_API_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY, GOOGLE_API_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getPlaceDetails(placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=ko`, {
    headers: {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'displayName,primaryTypeDisplayName',
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error(`API 에러 ${res.status}:`, errText);
    return {};
  }
  return res.json();
}

async function main() {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, google_place_id, name')
    .not('google_place_id', 'is', null);

  if (error) { console.error('Supabase fetch 에러:', error); return; }

  console.log(`총 ${businesses.length}개 업체 primary_type_ko 업데이트 시작`);

  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    try {
      const details = await getPlaceDetails(b.google_place_id);
      const primary_type_ko = details.primaryTypeDisplayName?.text ?? null;

      if (primary_type_ko) {
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ primary_type_ko })
          .eq('id', b.id);

        if (updateError) {
          console.error(`[${i+1}] 저장 실패 (${b.name}):`, updateError.message);
        } else {
          console.log(`[${i+1}/${businesses.length}] ✅ ${b.name} → ${primary_type_ko}`);
        }
      } else {
        console.log(`[${i+1}/${businesses.length}] ⏭ ${b.name} → 타입 없음`);
      }

      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`[${i+1}] 에러 (${b.name}):`, e.message);
    }
  }

  console.log('완료!');
}

main().catch(console.error);