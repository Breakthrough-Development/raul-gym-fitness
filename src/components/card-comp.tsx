import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";

export interface CardCompProps {
  title: string;
  description: string;
  content: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const CardComp = ({
  title,
  description,
  content,
  className,
  footer,
}: CardCompProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export { CardComp };
