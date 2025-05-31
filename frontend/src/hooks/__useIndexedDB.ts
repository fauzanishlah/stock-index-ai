// // import { ChatSession } from '@/types/chat';
// import { useEffect, useState } from 'react';

// const DB_NAME = 'chatDB';
// const STORE_NAME = 'sessions';

// const useIndexedDB = () => {
//   const [db, setDb] = useState<IDBDatabase | null>(null);

//   useEffect(() => {
//     const openDB = async () => {
//       return new Promise<IDBDatabase>((resolve, reject) => {
//         const request = indexedDB.open(DB_NAME, 1);

//         request.onupgradeneeded = (event) => {
//           const db = (event.target as IDBOpenDBRequest).result;
//           if (!db.objectStoreNames.contains(STORE_NAME)) {
//             const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
//             store.createIndex('createdAt', 'createdAt', { unique: false });
//           }
//         };

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//       });
//     };

//     openDB().then(setDb);
//   }, []);

//   const getSession = async (sessionId: string): Promise<ChatSession> => {
//     return new Promise((resolve, reject) => {
//       if (!db) return reject('Database not initialized');
//       const transaction = db.transaction(STORE_NAME, 'readonly');
//       const store = transaction.objectStore(STORE_NAME);
//       const request = store.get(sessionId);

//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject(request.error);
//     });
//   };

//   const saveSession = async (session: ChatSession) => {
//     if (!db) return;
//     const transaction = db.transaction(STORE_NAME, 'readwrite');
//     const store = transaction.objectStore(STORE_NAME);
//     store.put(session);
//   };

//   return { getSession, saveSession };
// };

// export default useIndexedDB;