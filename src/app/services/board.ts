import { inject, Injectable } from '@angular/core';
import { Database, ref, set, get, onValue } from '@angular/fire/database';
import { Column } from '../models/Task-model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private db = inject(Database);

  // دریافت تغییرات از Firebase
  listenToColumns(callback: (columns: Column[]) => void) {
    const columnsRef = ref(this.db, 'project/columns');

    return onValue(columnsRef, (snapshot) => {
      const data = snapshot.val();

      const columns = data
        ? Object.values(data).map((col: any) => ({
            ...col,
            tasks: Array.isArray(col.tasks) ? col.tasks : [],
          }))
        : [];

      callback(columns);
    });
  }

  // ذخیره ستون‌ها در Firebase
  saveColumns(columns: Column[]) {
    const columnsRef = ref(this.db, 'project/columns');

    return set(columnsRef, columns);
  }

  async initializeColumns(columns: Column[]) {
    const columnsRef = ref(this.db, 'project/columns');

    const snapshot = await get(columnsRef);

    if (!snapshot.exists()) {
      await set(columnsRef, columns);
    }
  }
}
