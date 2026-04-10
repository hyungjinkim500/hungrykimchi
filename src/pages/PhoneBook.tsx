import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PhoneBook() {
  const [status, setStatus] = useState('연결 확인 중...')

  useEffect(() => {
    supabase.from('businesses').select('count').then(({ error }) => {
      if (error) setStatus('❌ 연결 실패: ' + error.message)
      else setStatus('✅ Supabase 연결 성공!')
    })
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <p>{status}</p>
    </div>
  )
}
