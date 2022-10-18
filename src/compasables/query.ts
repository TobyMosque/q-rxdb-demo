import { RxDocument, RxQuery } from 'rxdb';
import { computed, Ref } from 'vue';

export async function useQuery<T>(
  doc: Ref<T | undefined> | undefined,
  query: () => RxQuery<T, RxDocument<T>> | RxQuery<T, RxDocument<T>[]>
): Promise<void> {
  if (!doc) {
    return;
  }
  const items = await query().exec();
  const item = Array.isArray(items) ? items[0] : items;
  doc.value = item.toMutableJSON();
  item.$.subscribe(() => {
    doc.value = item.toMutableJSON();
  });
}

export async function useArrayQuery<T, TKey>(
  doc: Ref<T[]> | undefined,
  pk: (doc: T) => TKey,
  query: () => RxQuery<T, RxDocument<T>[]>
): Promise<void> {
  if (!doc) {
    return;
  }
  const map = computed(() => {
    return doc.value.reduce((map, doc, index) => {
      map.set(pk(doc), index);
      return map;
    }, new Map<TKey, number>());
  });
  const items = await query().exec();
  doc.value = items.map((item) => item.toMutableJSON());
  for (const item of items) {
    item.$.subscribe(() => {
      const index = map.value.get(pk(item));
      if (index) {
        doc.value[index] = item.toMutableJSON();
      }
    });
  }
}
