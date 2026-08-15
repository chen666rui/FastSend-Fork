export interface TransferRecord {
  time: number
  role: 'send' | 'receive'
  size: number
  name: string
}

const KEY = 'fs-transfer-history'

export function useTransferHistory() {
  const records = ref<TransferRecord[]>([])

  function load() {
    try {
      records.value = JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      records.value = []
    }
  }

  function push(rec: Omit<TransferRecord, 'time'>) {
    load()
    records.value.unshift({ ...rec, time: Date.now() })
    records.value = records.value.slice(0, 20)
    localStorage.setItem(KEY, JSON.stringify(records.value))
  }

  function clear() {
    records.value = []
    localStorage.removeItem(KEY)
  }

  load()
  return { records, push, clear }
}