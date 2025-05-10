import { openDB } from 'idb'

export const getDB = async () => {
  return await openDB('geston-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('chamados')) {
        db.createObjectStore('chamados', { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}
