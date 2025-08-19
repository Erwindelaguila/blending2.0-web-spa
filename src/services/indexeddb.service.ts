// src/services/indexedDBService.ts
import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "BlendingDB";
const DB_VERSION = 3; // Incrementa si agregas nuevos stores
const STORES = ["StockDisponible", "Asignacion"]; // <-- Aquí defines todos los stores

export async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      for (const storeName of STORES) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { autoIncrement: true });
        }
      }
    },
  });
}

export async function saveData(storeName: string, data: any[]) {
  if (!STORES.includes(storeName)) {
    throw new Error(`El store "${storeName}" no está configurado en STORES`);
  }

  try {
    const db = await getDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    for (const item of data) {
      await store.put(item);
    }

    await tx.done;
  } catch (error) {
    console.error(`❌ Error al guardar en IndexedDB [${storeName}]`, error);
  }
}

export async function getAllData(storeName: string): Promise<any[]> {
  if (!STORES.includes(storeName)) {
    throw new Error(`El store "${storeName}" no está configurado en STORES`);
  }

  const db = await getDB();
  return db.getAll(storeName);
}

export async function clearData(storeName: string) {
  if (!STORES.includes(storeName)) {
    throw new Error(`El store "${storeName}" no está configurado en STORES`);
  }

  try {
    const db = await getDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.objectStore(storeName).clear();
    await tx.done;

    console.log(`✅ Todos los datos en IndexedDB store [${storeName}] han sido eliminados`);
  } catch (error) {
    console.error(`❌ Error al eliminar datos de IndexedDB [${storeName}]`, error);
  }
}
