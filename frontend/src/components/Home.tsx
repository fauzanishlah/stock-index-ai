export default function Home() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl px-4">
        <input
          name="message"
          placeholder="Ask anything"
          className="w-full rounded-lg border p-4 shadow-lg focus:outline-none focus:ring-2"
        />
      </form>
    </div>
  );
}
