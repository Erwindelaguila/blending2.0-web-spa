// src/services/indexedDBService.ts
import { openDB } from "idb";

const DB_NAME = "BlendingDB";
const STORE_NAME = "StockDisponible";

export async function getDB() {
  return openDB(DB_NAME, 2, {
    // <-- antes era 1
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { autoIncrement: true });
      } else {
        db.deleteObjectStore(STORE_NAME); // <- eliminar y crear de nuevo
        db.createObjectStore(STORE_NAME, { autoIncrement: true });
      }
    },
  });
}

export async function saveStockDisponible(stockDisponible: any[]) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const item of stockDisponible) {
      await store.put(item); // inserta o actualiza
    }

    await tx.done;
  } catch (error) {
    console.error("❌ Error al guardar en IndexedDB", error);
  }
}

export async function getAllStockDisponible(): Promise<any[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function clearStockDisponible() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await store.clear(); // 🔥 Limpia todo
    await tx.done;

    console.log("✅ Todos los datos en IndexedDB han sido eliminados");
  } catch (error) {
    console.error("❌ Error al eliminar datos de IndexedDB", error);
  }
}
