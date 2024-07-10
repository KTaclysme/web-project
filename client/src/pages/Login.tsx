import { useMutation, gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/style/toastStyle.scss";// Import your custom toast styles
import { useAuth } from "../context/AuthContext";
import client from "@/apollo-client";
import logo from "../assets/logo-mixed.png";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(authInput: { username: $username, password: $password }) {
      access_token
    }
  }
`;

export const GET_USER_INFO = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN_MUTATION);
  const { login: authLogin } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await login({
        variables: { username, password },
      });
      const token = response.data.login.access_token;
      localStorage.setItem("accessToken", token);

      const { data } = await client.query({
        query: GET_USER_INFO,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      const userId = data.me.id;
      localStorage.setItem("userId", userId);
      authLogin(data.me);

      toast.success("Connexion réussie ! Bienvenue !", {
        className: "toast-success",
      });
      // Ajoutez un léger délai pour permettre à l'utilisateur de lire le toast avant la redirection
      setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5 seconds delay
    } catch (error: any) {
      console.error("Error during login:", error);
      setError("Nom d’utilisateur ou mot de passe incorrect.");
      toast.error("Nom d’utilisateur ou mot de passe incorrect.", {
        className: "toast-error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="mx-auto max-w-xl space-y-6 bg-white p-8 shadow-lg rounded-lg"
        style={{ width: "650px" }}
      >
        <div className="space-y-2 text-center">
          <img
            alt="logo"
            src={logo}
            width={300}
            style={{ marginBottom: 40, margin: "auto" }}
          />
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-muted-foreground">
            Entrez vos données pour vous connecter à votre compte.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="username">Pseudo</Label>
            <Input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            Se connecter
          </Button>
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              Erreur: {error}
            </p>
          )}
        </form>
        <Link
          to="/signup"
          className="inline-block w-full text-center text-sm underline"
        >
          S'inscrire ?
        </Link>
      </div>
    </div>
  );
};

export default Login;
