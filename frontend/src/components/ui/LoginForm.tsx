interface LoginFormProps {
  username: string;
  password: string;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onSetUsername: (username: string) => void;
  onSetPassword: (password: string) => void;
}

const LoginForm = ({
  username,
  password,
  // error,
  onSubmit,
  onSetUsername,
  onSetPassword,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
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

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
