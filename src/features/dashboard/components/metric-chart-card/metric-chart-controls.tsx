import { Button } from "@/components/ui/button";
import { Mode } from "../../types";

type MetricChartControlsProps = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onPrev: () => void;
  onNext: () => void;
};

export const MetricChartControls = ({
  mode,
  setMode,
  onPrev,
  onNext,
}: MetricChartControlsProps) => {
  return (
    <>
      <div className="flex rounded-md border overflow-hidden">
        <Button
          variant={mode === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("month")}
        >
          Mes
        </Button>
        <Button
          variant={mode === "year" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("year")}
        >
          Año
        </Button>
        <Button
          variant={mode === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("all")}
        >
          Todo
        </Button>
      </div>
      {mode !== "all" && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onPrev}>
            Anterior
          </Button>
          <Button variant="ghost" size="sm" onClick={onNext}>
            Siguiente
          </Button>
        </div>
      )}
    </>
  );
};

