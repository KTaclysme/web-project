import { useMutation, gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import client from "@/apollo-client";

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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN_MUTATION);

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
      });

      localStorage.setItem("userInfo", JSON.stringify(data.me));

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="mx-auto max-w-sm space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-muted-foreground">
            Entrez votre Username ci-dessous pour vous connecter à votre compte.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="username">Pseudo</Label>
            <Input
              id="username"
              type="username"
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
}
