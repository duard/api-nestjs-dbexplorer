// Utilitário global para trim em todos os campos string de um objeto
export function trimFields<T extends Record<string, any>>(row: T): T {
  if (!row || typeof row !== 'object') return row;
  const trimmed: any = {};
  for (const key in row) {
    if (typeof row[key] === 'string') {
      trimmed[key] = row[key].trim();
    } else {
      trimmed[key] = row[key];
    }
  }
  return trimmed;
}