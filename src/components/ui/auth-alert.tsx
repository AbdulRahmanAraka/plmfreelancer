type AuthAlertProps = {
  message?: string;
  error?: string;
};

export function AuthAlert({ message, error }: AuthAlertProps) {
  if (!message && !error) return null;

  if (error) {
    return (
      <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {error}
      </p>
    );
  }

  return (
    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      {message}
    </p>
  );
}
