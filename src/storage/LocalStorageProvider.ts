import { IStorageProvider } from '../types.js'

export class LocalStorageProvider implements IStorageProvider {
  private storageKey: string

  constructor(key: string) {
    this.storageKey = key
  }

  async get() {
    const value = localStorage.getItem(this.storageKey)
    return value ? JSON.parse(value) : null
  }

  async set(value: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(value))
  }

  async remove() {
    localStorage.removeItem(this.storageKey)
  }
}
