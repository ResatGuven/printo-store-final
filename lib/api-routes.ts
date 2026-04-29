// API yardımcı fonksiyonlar ve tipler

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

// Client-side fetch helpers
export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      return { data: null, error: err.error || 'Bilinmeyen hata' }
    }
    const data = await res.json()
    return { data, error: null }
  } catch (e) {
    return { data: null, error: 'Bağlantı hatası' }
  }
}

export async function apiPost<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      return { data: null, error: err.error || 'Bilinmeyen hata' }
    }
    const data = await res.json()
    return { data, error: null }
  } catch (e) {
    return { data: null, error: 'Bağlantı hatası' }
  }
}

export async function apiPatch<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      return { data: null, error: err.error || 'Bilinmeyen hata' }
    }
    const data = await res.json()
    return { data, error: null }
  } catch (e) {
    return { data: null, error: 'Bağlantı hatası' }
  }
}

export async function apiDelete(url: string): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const res = await fetch(url, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      return { data: null, error: err.error || 'Bilinmeyen hata' }
    }
    return { data: { success: true }, error: null }
  } catch (e) {
    return { data: null, error: 'Bağlantı hatası' }
  }
}

// Category & Filament helpers
export const CATEGORY_LABELS: Record<string, string> = {
  DECORATION: 'Dekorasyon',
  AUTOMOTIVE: 'Otomotiv',
  SPARE_PART: 'Yedek Parça',
  HOME: 'Ev & Yaşam',
  TOY: 'Oyuncak',
  EDUCATION: 'Eğitim',
  OTHER: 'Diğer',
}

export const FILAMENT_LABELS: Record<string, { temp: string; strength: string }> = {
  PLA:   { temp: '200°C', strength: 'Orta' },
  PETG:  { temp: '240°C', strength: 'Yüksek' },
  ABS:   { temp: '250°C', strength: 'Çok Yüksek' },
  TPU:   { temp: '225°C', strength: 'Esnek' },
  RESIN: { temp: 'UV',    strength: 'Detaylı' },
  ASA:   { temp: '255°C', strength: 'UV Dayanıklı' },
  NYLON: { temp: '260°C', strength: 'Mühendislik' },
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING:       'Hazırlanıyor',
  PRINTING:      'Basılıyor',
  QUALITY_CHECK: 'Kalite Kontrolü',
  SHIPPED:       'Kargolandı',
  DELIVERED:     'Teslim Edildi',
  CANCELLED:     'İptal Edildi',
}
