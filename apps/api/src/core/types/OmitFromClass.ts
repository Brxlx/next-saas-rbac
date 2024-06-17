/**
 * Build a type from a class that correctly displays its properties and omits it from the typing properties.
 * @param typing
 * @param property
 */
export type OmitFromClass<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
