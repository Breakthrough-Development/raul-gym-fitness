export type Mode = "month" | "year" | "all";

export type ApiResponse =
  | {
      mode: "month";
      year: number;
      month: number;
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    }
  | {
      mode: "year";
      year: number;
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    }
  | {
      mode: "all";
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    };

export type QueryParams = {
  mode?: Mode;
  year?: number;
  month?: number;
};

