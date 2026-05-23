export function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}
