export type Select<T> = {
  select?: {
    [key in keyof T]?: boolean;
  };
};
