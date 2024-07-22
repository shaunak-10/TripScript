interface ErrorBoxProps {
  error: string;
}

export default function ErrorBox({ error }: Readonly<ErrorBoxProps>) {
  return (
    <div className="error-box w-full px-4 py-3 mt-4 rounded-md bg-red-100 border border-red-400 text-red-700">
      <p className="text-sm break-words">{error}</p>
    </div>
  );
}
