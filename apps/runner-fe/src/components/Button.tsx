type Props = {};

export default function Button({}: Props) {
  return (
    <button
      onClick={() => {
        fetch("http://localhost:8787/api/v1/users")
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.error(err));
      }}
    >
      Button
    </button>
  );
}
