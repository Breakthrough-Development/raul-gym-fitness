import { Separator } from "@/components/ui/separator";

interface HeadingProps {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
}

const Heading = ({ title, description, tabs }: HeadingProps) => {
  return (
    <header className="flex flex-col gap-y-8">
      {tabs}
      <div className="px-8">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
      </div>

      <Separator />
    </header>
  );
};

export default Heading;
