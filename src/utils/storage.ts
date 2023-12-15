export const getStorage = async (key: string) => {
  const value = localStorage.getItem(key)

  if (value) return JSON.parse(value)
  return null
}

export const setStorage = async (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const removeStorage = async (key: string) => {
  localStorage.removeItem(key)
}
