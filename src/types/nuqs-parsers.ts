import { SingleParserBuilder } from "nuqs";

/** Parser type for numeric URL params (page, size) */
export type NumericParserType = Omit<
  SingleParserBuilder<number>,
  "parseServerSide"
> & {
  readonly defaultValue: number;
  parseServerSide(value: string | string[] | undefined): number;
};

/** Parser type for string URL params (search) */
export type StringParserType = Omit<
  SingleParserBuilder<string>,
  "parseServerSide"
> & {
  readonly defaultValue: string;
  parseServerSide(value: string | string[] | undefined): string;
};

/** Standard pagination options for nuqs */
export type PaginationOptions = {
  shallow: boolean;
  clearOnDefault: boolean;
};
