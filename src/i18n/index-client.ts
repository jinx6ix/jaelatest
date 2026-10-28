import { DEFAULTS, type DictKey } from './defaults'

export const makeT =
  (dict: Record<string, string>) =>
  (key: DictKey, vars?: Record<string, string | number>) => {
    let s = dict[key] ?? DEFAULTS[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }

export type TFn = ReturnType<typeof makeT>
