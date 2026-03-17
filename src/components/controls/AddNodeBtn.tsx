export function AddNodeBtn({ addNode }: { addNode: () => void }) {
  return (
    <button
      style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
      onClick={addNode}
    >
      Добавить ноду
    </button>
  );
}