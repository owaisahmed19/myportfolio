// Local Database Handler for Brief Submissions using IndexedDB & LocalStorage fallback

const DB_NAME = 'PortfolioBriefsDB';
const DB_VERSION = 1;
const STORE_NAME = 'briefs';

export function initDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported, falling back to LocalStorage.');
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('email', 'email', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };

    request.onerror = (e) => {
      console.error('IndexedDB error:', e.target.error);
      resolve(null);
    };
  });
}

export async function saveSubmission(submission) {
  const data = {
    ...submission,
    timestamp: new Date().toISOString(),
    id: Date.now(),
  };

  // 1. Save to LocalStorage for quick access
  const existing = JSON.parse(localStorage.getItem('brief_submissions') || '[]');
  existing.push(data);
  localStorage.setItem('brief_submissions', JSON.stringify(existing));

  // 2. Save to IndexedDB
  try {
    const db = await initDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.add(data);
    }
  } catch (err) {
    console.error('Error saving to IndexedDB:', err);
  }

  return data;
}

export async function getSubmissions() {
  return JSON.parse(localStorage.getItem('brief_submissions') || '[]');
}
