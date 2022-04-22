export type Enumerize<T> = T[keyof T];

export type NonNullableObject<T extends object> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type NullableObject<T extends object> = {
  [K in keyof T]: Partial<T[K]>;
};

export type DeepNonNullable<T> =
  & { [K in keyof T]: DeepNonNullable<T[K]> }
  & NonNullable<T>;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
