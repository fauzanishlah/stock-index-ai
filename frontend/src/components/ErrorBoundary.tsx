import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
// import { Button } from '@/components/ui/button'; // Assuming you have a button component

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary();
    navigate("/");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center p-4">
      <h1 className="text-4xl font-bold text-destructive">
        Something went wrong
      </h1>
      <pre className="text-sm text-muted-foreground max-w-2xl overflow-auto">
        {error.message}
      </pre>
      <div className="flex gap-2">
        <button onClick={handleReset}>Go to Home</button>
        <button className="outline" onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error) => {
      // You can log errors to an error reporting service here
      console.error("Error Boundary caught:", error);
    }}
  >
    {children}
  </ReactErrorBoundary>
);
