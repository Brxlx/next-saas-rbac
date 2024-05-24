import { ComparisonOperator } from './comparison-operator';

export type WhereClause<T> = {
  [key in keyof T]?:
    | T[key]
    | {
        [operator in ComparisonOperator]?: T[key];
      };
};
