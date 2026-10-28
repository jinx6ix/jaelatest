import { cachedGlobal } from '@/lib/globals'
import { DEFAULTS, type DictKey } from './defaults'
import { makeT as makeTClient } from './index-client'

export type Dict = Record<DictKey, string>

/** English defaults merged with any overrides or translations saved in the Translations global. */
export async function getDictionary(locale: string): Promise<Dict> {
  const dict: Record<string, string> = { ...DEFAULTS }
  try {
    const tr: any = await cachedGlobal('translations', locale, 0)
    for (const e of tr?.entries || []) if (e?.key && e?.value) dict[e.key] = e.value
  } catch {
    /* fall back to defaults */
  }
  return dict as Dict
}

export const makeT = makeTClient
export type TFn = ReturnType<typeof makeTClient>
