import { ReactFlowProvider } from "reactflow";
import { Flow } from "./hooks/Flow";

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}