// A union type that has all keys of T that have type V
type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

/**
 * Convert an array of objects with a unique property into a dictionary (object)
 * @param arr The source array
 * @param keyProp The name of the property that will provide the keys for the dictionary
 * @param valueProp The name of the property that will provide the values for the dictionary
 */
export function asDictionary<
  T extends { [P in K]: any },
  K extends KeyOfType<T, string | number | symbol>,
  V extends keyof T
>(arr: T[], keyProp: K, valueProp: V) {
  const result = {} as Record<T[K], T[V]>;
  for (const item of arr) result[item[keyProp]] = item[valueProp];
  return result;
}

/**
 * Convert an array of objects with a unique set of two properties into a nested dictionary (object)
 * @param arr The source array
 * @param keyProp1 The name of the property that will provide the keys for the outer dictionary
 * @param keyProp2 The name of the property that will will provide they keys for the inner dictionary
 * @param valueProp The name of the property that will provide the values for the dictionary
 */
export function asNestedDictionary<
  T extends { [P1 in K1]: any } & { [P2 in K2]: any },
  K1 extends KeyOfType<T, string | number | symbol>,
  K2 extends KeyOfType<T, string | number | symbol>,
  V extends keyof T
>(arr: T[], keyProp1: K1, keyProp2: K2, valueProp: V) {
  const result = {} as Record<T[K1], Record<T[K2], T[V]>>;

  for (const item of arr) {
    if (!result[item[keyProp1]])
      result[item[keyProp1]] = {} as Record<T[K2], T[V]>;
    result[item[keyProp1]][item[keyProp2]] = item[valueProp];
  }

  return result;
}
