import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signInWithKakao = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: 'https://hungrykimchi.com',
      scopes: 'profile_nickname profile_image',
    },
  })
  if (error) throw error
}

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://hungrykimchi.com',
    },
  })
  if (error) throw error
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const deleteUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('로그인 상태가 아닙니다')
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('계정 삭제에 실패했습니다')
}
