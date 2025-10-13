import { RedirectToast } from "@/components/redirect-toast";

type RootTemplateProps = {
  children: React.ReactNode;
};

/**
 *
 * Bug: makes it run once like it's a layout.
 */
export default function RootTemplate({ children }: RootTemplateProps) {
  return (
    <>
      {children}
      <RedirectToast />
    </>
  );
}
