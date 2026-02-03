import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm, SignUpForm } from "./_components";

export default async function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col gap-12">
      <h1 className="text-4xl font-bold uppercase tracking-widest">
        Next Steps
      </h1>
      <Card className="w-108">
        <Tabs defaultValue="signIn">
          <TabsList className="mb-6 ml-6">
            <TabsTrigger value="signIn">Sign In</TabsTrigger>
            <TabsTrigger value="signUp">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signIn">
            <SignInForm />
          </TabsContent>
          <TabsContent value="signUp">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
