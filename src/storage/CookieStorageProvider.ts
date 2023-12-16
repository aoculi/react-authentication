import { IStorageProvider } from '../types.js'

export class CookieStorageProvider implements IStorageProvider {
  private storageKey: string

  constructor(key: string) {
    this.storageKey = key
  }

  async get() {
    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(this.storageKey))
    return value ? JSON.parse(value.split('=')[1]) : null
  }

  async set(value: any) {
    document.cookie = `${this.storageKey}=${JSON.stringify(value)}; path=/`
  }

  async remove() {
    document.cookie = `${this.storageKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}
