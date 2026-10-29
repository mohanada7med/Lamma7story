/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoryDocument } from '../types/editor';

const DB_NAME = 'LAMMA7_Story_Studio_DB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const DRAFT_STORAGE_KEY = 'lamma7_story_current_draft';

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        const store = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback localStorage implementation if IndexedDB is blocked in some contexts
const LOCAL_STORAGE_KEY = 'lamma7_saved_projects_fallback';

function getFallbackProjects(): StoryDocument[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFallbackProjects(projects: StoryDocument[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

/**
 * Save or update a project
 */
export async function saveProject(doc: StoryDocument): Promise<void> {
  const updatedDoc: StoryDocument = {
    ...doc,
    updatedAt: Date.now()
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(updatedDoc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB failed, using localStorage fallback', err);
    const existing = getFallbackProjects();
    const idx = existing.findIndex((p) => p.id === updatedDoc.id);
    if (idx >= 0) {
      existing[idx] = updatedDoc;
    } else {
      existing.unshift(updatedDoc);
    }
    saveFallbackProjects(existing);
  }

  // Also update current draft
  saveDraft(updatedDoc);
}

/**
 * Fetch all saved projects
 */
export async function getAllProjects(): Promise<StoryDocument[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result as StoryDocument[];
        results.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read failed, fallback used', err);
    const fallback = getFallbackProjects();
    fallback.sort((a, b) => b.updatedAt - a.updatedAt);
    return fallback;
  }
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed, fallback used', err);
    const list = getFallbackProjects().filter((p) => p.id !== id);
    saveFallbackProjects(list);
  }
}

/**
 * Auto-save current working draft to localStorage for instant reload recovery
 */
export function saveDraft(doc: StoryDocument): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(doc));
  } catch (err) {
    console.warn('Failed to save draft to localStorage', err);
  }
}

/**
 * Load draft from localStorage
 */
export function loadDraft(): StoryDocument | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoryDocument;
    }
  } catch (err) {
    console.warn('Failed to load draft from localStorage', err);
  }
  return null;
}

/**
 * Export document as a portable .lamma7 JSON backup file
 */
export function exportProjectFile(doc: StoryDocument): void {
  const json = JSON.stringify(doc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = (doc.name || 'lamma7-story').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
  a.href = url;
  a.download = `${safeTitle}.lamma7.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse an imported project file
 */
export function importProjectFile(file: File): Promise<StoryDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as StoryDocument;
        if (!parsed || !Array.isArray(parsed.elements) || typeof parsed.width !== 'number') {
          throw new Error('تنسيق ملف المشروع غير صالح');
        }
        // Assign new ID and refreshed timestamps so it doesn't collide
        parsed.id = 'imported_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        parsed.updatedAt = Date.now();
        parsed.createdAt = Date.now();
        resolve(parsed);
      } catch (err) {
        reject(new Error('تعذر قراءة ملف المشروع: تأكد أنه ملف .json صالح'));
      }
    };
    reader.onerror = () => reject(new Error('فشلت قراءة الملف'));
    reader.readAsText(file);
  });
}
