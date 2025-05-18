declare module 'lowdb' {
  interface LowdbSync<T> {
    defaults(data: T): LowdbSync<T>;
    get<K extends keyof T>(name: K): LowdbChain<T[K]>;
    set<K extends keyof T>(name: K, value: T[K]): LowdbSync<T>;
    write(): void;
  }

  interface LowdbChain<T> {
    find(query: Partial<T>): LowdbChain<T>;
    assign(data: Partial<T>): LowdbChain<T>;
    value(): T;
    push(...items: T[]): LowdbChain<T[]>;
    write(): void;
    remove(query: Partial<T>): LowdbChain<T>;
  }

  function low<T>(adapter: any): LowdbSync<T>;
  export default low;
}

declare module 'lowdb/adapters/FileSync' {
  export default class FileSync<T> {
    constructor(filename: string);
  }
} 