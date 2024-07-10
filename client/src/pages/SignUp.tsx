import { useMutation, gql } from "@apollo/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/style/toastStyle.scss";
import logo from "../assets/logo-mixed.png";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(authInput: { username: $username, password: $password }) {
      id
      username
    }
  }
`;

const validateUsername = (username: string): string | null => {
  const regex = /^[a-zA-Z0-9]{4,24}$/;
  if (username.length < 4) {
    return "Le pseudo doit contenir au moins 4 caractères.";
  }
  if (username.length > 24) {
    return "Le pseudo ne doit pas dépasser 24 caractères.";
  }
  if (!regex.test(username)) {
    return "Le pseudo ne doit contenir que des lettres et des chiffres.";
  }
  return null;
};

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [signup] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => {
      console.error("SignUp mutation error:", error);
      if (error.networkError) {
        setError(
          "Erreur réseau : Impossible d'atteindre le serveur. Veuillez réessayer plus tard."
        );
      } else if (error.graphQLErrors.length > 0) {
        setError(error.graphQLErrors[0].message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
      toast.error(`Erreur: ${error.message}`, {
        className: "toast-error",
      });
    },
  });

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    const usernameValidationError = validateUsername(username);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      return;
    }
    setUsernameError(null);

    try {
      const { data } = await signup({
        variables: { username, password },
      });
      console.log("Signup response:", data);
      toast.success(
        "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        {
          className: "toast-success",
        }
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="mx-auto max-w-xl space-y-6 bg-white p-8 shadow-lg rounded-lg"
        style={{ width: "650px" }}
      >
        <div className="space-y-2 text-center">
          <img
            src={logo}
            width={300}
            style={{ marginBottom: 40, margin: "auto" }}
          />
          <h1 className="text-3xl font-bold">Inscription</h1>
          <p className="text-muted-foreground">
            Entrez votre Username ci-dessous pour vous connecter à votre compte.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-2">
            <Label htmlFor="username">Pseudo</Label>
            <Input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <p className="text-red-600 text-sm">{usernameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              Erreur: {error}
            </p>
          )}
        </form>
        <Link
          to="/login"
          className="inline-block w-full text-center text-sm underline"
        >
          Déjà un compte, se connecter
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
