import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js/min'

export type CountryOption = { iso: string; name: string; dial: string }

const POPULAR = ['KE', 'TZ', 'UG', 'RW', 'GB', 'US', 'DE', 'FR', 'IT', 'NL', 'IN', 'CN', 'AE', 'ZA', 'AU', 'CA']

/** Every country with its dial code, names in the visitor's language. Popular markets come first. */
export function buildCountryList(locale: string): CountryOption[] {
  let names: Intl.DisplayNames | null = null
  try {
    names = new Intl.DisplayNames([locale], { type: 'region' })
  } catch {
    names = null
  }
  const all = getCountries().map((iso) => ({
    iso: iso as string,
    name: names?.of(iso) || iso,
    dial: `+${getCountryCallingCode(iso as CountryCode)}`,
  }))
  const pop = POPULAR.map((p) => all.find((c) => c.iso === p)).filter(Boolean) as CountryOption[]
  const rest = all.filter((c) => !POPULAR.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name, locale))
  return [...pop, ...rest]
}
