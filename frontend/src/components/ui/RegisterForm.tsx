import { useState } from "react";
import { register } from "@/api/auth";

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onSuccessRegister?: () => void;
}

const RegisterForm = ({ onSubmit, onSuccessRegister }: RegisterFormProps) => {
  const [username, onSetUsername] = useState("");
  const [password, onSetPassword] = useState("");
  const [fullname, onSetFullname] = useState("");
  const [email, onSetEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
    const data = await register(username, password, email, fullname);
    console.log(data);
    onSuccessRegister?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => onSetUsername(e.target.value)}
          className="mt-1 w-full rounded-md border p-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => onSetPassword(e.target.value)}
          className="mt-1 w-full rounded-md border p-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fullname
        </label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => onSetFullname(e.target.value)}
          className="mt-1 w-full rounded-md border p-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => onSetEmail(e.target.value)}
          className="mt-1 w-full rounded-md border p-2 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-cyan-400 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
