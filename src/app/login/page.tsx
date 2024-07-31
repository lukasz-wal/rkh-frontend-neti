import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ConnectWalletButton } from "@/components/ConnectWalletButton";

function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConnectWalletButton />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
