import { LucideMessageSquareWarning } from "lucide-react";
import { cloneElement } from "react";

type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement<{ className?: string }>;
  button?: React.ReactElement<{ className?: string }>;
};

const Placeholder = ({
  label,
  icon = <LucideMessageSquareWarning />,
  button = <div />,
}: PlaceholderProps) => {
  return (
    <section className="flex-1 self-center flex flex-col items-center justify-center gap-y-2" data-testid="notifications-empty-state">
      {cloneElement(icon, {
        className: "w-16 h-16",
      })}
      <h2 className="text-xl text-center md:text-2xl">{label}</h2>
      {cloneElement(button, {
        className: "h-10",
      })}
    </section>
  );
};

export default Placeholder;
