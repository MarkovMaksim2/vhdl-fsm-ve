import { useCallback, useMemo, useState } from "react";
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
import { NodeSidebar } from "./../components/controls/NodeSidebar";
import { EdgeSidebar } from "../components/controls/EdgeSidebar";
import { ModuleSidebar } from "../components/controls/ModuleSidebar";

export function Flow() {
  const {
    nodes, edges,
    setNodes, setEdges,
    onConnect, addNode,
    setSelectedNode, selectedNode,
    setSelectedEdge, selectedEdge,
    moduleConfig, setModuleConfig
  } = useFlow();
  const [mode, setMode] = useState<"module" | "node" | "edge">("module");
  const nodeTypes = useMemo(() => ({ state: StateNode }), []);

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
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      overflow: "hidden"
    }}>
      <div style={{
        width: '480px',
        height: '100%',
        background: '#2e2e3e',
        color: 'white',
        overflowY: 'auto',
        borderRight: '1px solid #4a4a6a'
      }}>
        {mode === "node" && selectedNode ? (
          <NodeSidebar
            node={selectedNode}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            setSelectedNode={setSelectedNode}
            setSelectedEdge={setSelectedEdge}
            setMode={setMode}
          />
        ) : mode === "edge" && selectedEdge ? (
          <EdgeSidebar
            edge={selectedEdge}
            nodes={nodes}
            setEdges={setEdges}
            setSelectedNode={setSelectedNode}
            setSelectedEdge={setSelectedEdge}
            setMode={setMode}
          />
        ) : mode === "module" ? (
          <ModuleSidebar
            config={moduleConfig}
            setConfig={setModuleConfig}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
          />
        ) : (
          <div style={{ padding: 10 }}>Выберите ноду или переход</div>
        )}
      </div>

      <div style={{
        flexGrow: 1,
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(event, node) => {
            setSelectedNode(node);
            setSelectedEdge(null);
            setMode("node");
          }}
          onEdgeClick={(event, edge) => {
            setSelectedEdge(edge);
            setSelectedNode(null);
            setMode("edge");
          }}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
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
                marginRight: "8px",
                zIndex: 10
              }}
            >
              Добавить узел
            </button>
            <button
              onClick={() => setMode("module")}
              style={{
                padding: "8px 16px",
                background: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "8px",
                zIndex: 10
              }}
            >
              Модуль
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}