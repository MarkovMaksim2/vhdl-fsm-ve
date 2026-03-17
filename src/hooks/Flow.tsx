import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { StateNode } from "./../components/nodes/StateNode";
import { useFlow } from "./useFlow";

// Регистрируем типы узлов
const nodeTypes = {
  state: StateNode,
};

export function Flow() {
  const { nodes, edges, setNodes, setEdges, onConnect, addNode } = useFlow();

  // Обязательно добавляем обработчики изменений
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        // Эти пропсы важны для правильной работы
        selectNodesOnDrag={false}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background />
        <Controls />
        <Panel position="top-left">
          <button
            onClick={() => addNode()}
            style={{
              padding: "8px 16px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "8px"
            }}
          >
            Добавить узел
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}