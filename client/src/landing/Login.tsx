import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Component() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="text-muted-foreground">
          Entrez votre email ci-dessous pour vous connecter à votre compte.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
        </Button>
        <Link
          to="#"
          className="inline-block w-full text-center text-sm underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
}
