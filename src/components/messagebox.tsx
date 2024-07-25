interface MessageBoxProps {
  message: string;
  type: string;
}

export default function MessageBox(props: Readonly<MessageBoxProps>) {
  if (props.type === "success") {
    return (
      <div className="w-full px-4 py-3 mt-4 rounded-md bg-green-100 border border-green-400 text-green-700">
        <p className="text-sm break-words">{props.message}</p>
      </div>
    );
  } else {
    return (
      <div className="error-box w-full px-4 py-3 mt-4 rounded-md bg-red-100 border border-red-400 text-red-700">
        <p className="text-sm break-words">{props.message}</p>
      </div>
    );
  }
}
