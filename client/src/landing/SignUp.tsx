import { useMutation, gql } from "@apollo/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(authInput: { username: $username, password: $password }) {
      id
      username
    }
  }
`;

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [signup] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => {
      console.error("SignUp mutation error:", error);
      if (error.networkError) {
        setError(
          "Network error: Unable to reach the server. Please try again later."
        );
      } else if (error.graphQLErrors.length > 0) {
        setError(error.graphQLErrors[0].message);
      } else {
        setError("An unknown error occurred");
      }
    },
  });

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await signup({
        variables: { username, password },
      });
      console.log("Signup response:", data);
      navigate("/login");
    } catch (err) {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="mx-auto max-w-sm space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Inscription</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
              Error: {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
