import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Review = {
  id: string;
  business_id: string | null;
  user_id: string | null;
  rating: number | null;
  comment: string | null;
  is_korean: boolean | null;
  created_at: string;
  business_place_id: string | null;
  taste_score: number | null;
  ok_score: number | null;
  is_korean_run: 'yes' | 'no' | 'unknown' | null;
};

export type ReviewSummary = {
  count: number;
  avgTaste: number | null;
  avgOk: number | null;
  koreanRunYesPct: number | null;
};

export function useReviews(placeId: string | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    count: 0, avgTaste: null, avgOk: null, koreanRunYesPct: null,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    if (!placeId) return;
    fetchReviews();
  }, [placeId]);

  const fetchReviews = async () => {
    if (!placeId) return;
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_place_id', placeId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      const rows = data as Review[];
      setReviews(rows);
      computeSummary(rows);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserReview(rows.find(r => r.user_id === user.id) ?? null);
    }
    setLoading(false);
  };

  const computeSummary = (data: Review[]) => {
    if (!data.length) {
      setSummary({ count: 0, avgTaste: null, avgOk: null, koreanRunYesPct: null });
      return;
    }
    const withTaste = data.filter(r => r.taste_score != null);
    const withRating = data.filter(r => r.rating != null);
    let avgTaste: number | null = null;
    if (withTaste.length) {
      avgTaste = withTaste.reduce((a, r) => a + r.taste_score!, 0) / withTaste.length;
    } else if (withRating.length) {
      avgTaste = withRating.reduce((a, r) => a + r.rating!, 0) / withRating.length;
    }

    const withOk = data.filter(r => r.ok_score != null);
    const avgOk = withOk.length
      ? Math.round(withOk.reduce((a, r) => a + r.ok_score!, 0) / withOk.length)
      : null;

    const withKrNew = data.filter(r => r.is_korean_run != null);
    const withKrOld = data.filter(r => r.is_korean != null);
    let koreanRunYesPct: number | null = null;
    if (withKrNew.length) {
      koreanRunYesPct = Math.round((withKrNew.filter(r => r.is_korean_run === 'yes').length / withKrNew.length) * 100);
    } else if (withKrOld.length) {
      koreanRunYesPct = Math.round((withKrOld.filter(r => r.is_korean === true).length / withKrOld.length) * 100);
    }

    setSummary({ count: data.length, avgTaste, avgOk, koreanRunYesPct });
  };

  const submitReview = async (payload: {
    is_korean_run: 'yes' | 'no' | 'unknown';
    taste_score: number;
    ok_score: number;
    comment: string;
  }) => {
    if (!placeId) return { error: 'no placeId' };
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('reviews').insert({
      business_place_id: placeId,
      user_id: user?.id ?? null,
      taste_score: payload.taste_score,
      ok_score: payload.ok_score,
      is_korean_run: payload.is_korean_run,
      comment: payload.comment || null,
      rating: Math.round(payload.taste_score),
      is_korean: payload.is_korean_run === 'yes',
    });
    setSubmitting(false);
    if (!error) await fetchReviews();
    return { error };
  };

  return { reviews, summary, loading, submitting, userReview, submitReview };
}