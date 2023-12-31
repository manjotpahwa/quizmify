import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    // that means user is logged in
    return redirect("/dashboard");
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Welcome to Quizmify!</CardTitle>
          <CardDescription>
            Qiuzmify is an app that lets you create and play quizzes with your
            friends!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign In with Google"></SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}
