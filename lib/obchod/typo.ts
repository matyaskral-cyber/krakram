// Česká sazba: jednopísmenné předložky a spojky nesmí zůstat na konci řádku,
// číslo se nesmí oddělit od jednotky („1 g“, „18 let“, „1 500 Kč“).
const NBSP = " ";

export function cz(text: string) {
  return text
    .replace(/(^|[\s(„])([aiksvzouAIKSVZOU]) /g, `$1$2${NBSP}`)
    .replace(/(^|[\s(„])([aiksvzouAIKSVZOU]) /g, `$1$2${NBSP}`)
    .replace(/(\d) (?=\d{3}\b)/g, `$1${NBSP}`)
    .replace(/(\d) (g|ml|ks|Kč|let|%)/g, `$1${NBSP}$2`);
}
