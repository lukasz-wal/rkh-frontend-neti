import { MailCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ConnectMetamask } from "./metamask/ConnectMetamask";

type LoginMethod = {
  id: string;
  title: string;
  icon: any;
  connect: () => void;
};

const loginMethods: LoginMethod[] = [
  {
    id: "metamask",
    title: "Metamask",
    icon: MailCheck,
    connect: () => {},
  },
  {
    id: "ledger",
    title: "Ledger",
    icon: MailCheck,
    connect: () => {},
  },
];

interface LoginFormProps {}

export default function LoginForm({}: LoginFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod | null>();

  const renderLoginMethods = () => {
    return loginMethods.map((method) => {
      return (
        <Button
          key={method.id}
          onClick={() => setSelectedMethod(method)}
          className="flex items-center justify-center gap-2 w-full"
        >
          <method.icon size={24} />
          <span>{method.title}</span>
        </Button>
      );
    });
  };

  const renderLoginMethod = (method: string) => {
    switch (method) {
      case "metamask":
        return (
          <ConnectMetamask />
        );
      case "ledger":
        return (
          <>Ledger</>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {selectedMethod
        ? renderLoginMethod(selectedMethod.id)
        : renderLoginMethods()}
    </>
  );
}
