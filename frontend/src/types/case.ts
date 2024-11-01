type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${SnakeCase<U>}`
  : S

type CamelCase<S extends string> = S extends `${infer P}_${infer Q}`
  ? `${P}${Capitalize<CamelCase<Q>>}`
  : S

export type CamelizeKeys<T> = T extends Array<infer U>
  ? Array<CamelizeKeys<U>>
  : T extends object
    ? { [K in keyof T as CamelCase<string & K>]: CamelizeKeys<T[K]> }
    : T

export type SnakeizeKeys<T> = T extends Array<infer U>
  ? Array<SnakeizeKeys<U>>
  : T extends object
    ? { [K in keyof T as SnakeCase<string & K>]: SnakeizeKeys<T[K]> }
    : T
