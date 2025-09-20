import { CardComp } from "@/components/card-comp";
import { SignUpForm } from "@/features/auth/component/sign-up-form";
import { signInPath } from "@/paths";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardComp
        title="Sign Up"
        description="Sign up to get started"
        content={<SignUpForm />}
        footer={
          <Link className="text-sm text-muted-foreground" href={signInPath()}>
            Have an account? Sign In now.
          </Link>
        }
      ></CardComp>
    </div>
  );
};

export default SignUpPage;
