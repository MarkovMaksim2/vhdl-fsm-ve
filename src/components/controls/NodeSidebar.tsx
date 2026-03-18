import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useState } from "react";
import Editor from "@monaco-editor/react";

export function NodeSidebar({
  node,
  nodes,
  edges,
  setNodes,
  setEdges,
  setSelectedNode,
  setSelectedEdge,
  setMode
}: {
  node: Node | null;
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges?: React.Dispatch<React.SetStateAction<Edge[]>>;
  setSelectedNode?: React.Dispatch<React.SetStateAction<Node | null>>;
  setSelectedEdge?: React.Dispatch<React.SetStateAction<Edge | null>>;
  setMode?: React.Dispatch<React.SetStateAction<"module" | "node" | "edge">>;
}) {
  const [showEditor, setShowEditor] = useState(false);
  const [language] = useState<"javascript" | "verilog">("verilog");
  if (!node) return <div style={{ padding: 10 }}>Выберите ноду</div>;

  const connectedEdges = edges
    .filter((e) => e.source === node.id || e.target === node.id)
    .map((e) => {
      const connectedId = e.source === node.id ? e.target : e.source;
      const connectedNode = nodes.find((n) => n.id === connectedId);
      return {
        id: e.id ?? `${e.source}-${e.target}`,
        label: connectedNode ? connectedNode.data.label : connectedId,
        type: e.source === node.id ? "out" as const : "in" as const,
        edge: e,
      };
    });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );
    setSelectedNode?.({ ...node, data: { ...node.data, label: newLabel } });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value === undefined) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, code: value } } : n
      )
    );
    setSelectedNode?.({ ...node, data: { ...node.data, code: value } });
  };

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== node.id));
    setEdges?.((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
    setSelectedNode?.(null);
    setMode?.("module");
  };

  const deleteEdge = (edgeId: string) => {
    setEdges?.((eds) => eds.filter((e) => (e.id ?? `${e.source}-${e.target}`) !== edgeId));
  };

  return (
    <div style={{ padding: 10, width: 300, background: "#2e2e3e", color: "white" }}>
      <h3>Свойства</h3>

      <div style={{ marginBottom: 10 }}>
        <label>Название:</label>
        <input
          type="text"
          value={node.data.label}
          onChange={handleLabelChange}
          style={{
            width: "100%",
            padding: 4,
            borderRadius: 4,
            border: "none",
            marginTop: 4,
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Связи:</label>
  
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {connectedEdges.length > 0 ? (
        connectedEdges.map((n) => (
          <div
            key={n.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "6px",
              background: "#2a2a3a",
              border: "1px solid #3a3a4a",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3a3a4a";
              e.currentTarget.style.borderColor = n.type === "in" ? "#4ae290" : "#e24a4a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#2a2a3a";
              e.currentTarget.style.borderColor = "#3a3a4a";
            }}
          >
            <div
              onClick={() => {
                if (n) {
                  setSelectedNode?.(null);
                  setSelectedEdge?.(n.edge);
                  setMode?.("edge");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: n.type === "in" ? "#4ae290" : "#e24a4a",
                  borderRadius: "4px 0 4px 0", // Скошенные углы как в примере с переходами
                }}
              />
              <span style={{ 
                fontSize: 13,
                color: n.type === "in" ? "#4ae290" : "#e24a4a",
                fontWeight: 500
              }}>
                {n.type === "in" ? "Входящая:" : "Исходящая:"}
              </span>
              <span style={{ fontWeight: 500 }}>{n.label}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteEdge(n.id);
              }}
              style={{
                padding: "4px 8px",
                background: "#e24a4a",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                opacity: 0.9,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.background = "#ff5a5a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.background = "#e24a4a";
              }}
            >
              Удалить
            </button>
          </div>
        ))
      ) : (
        <div style={{
          padding: "12px 10px",
          background: "#2a2a3a",
          border: "1px dashed #3a3a4a",
          borderRadius: "6px",
          color: "#888",
          textAlign: "center",
          fontSize: 13
        }}>
          Нет связей
        </div>
      )}
    </div>
    </div>

      <button
        onClick={() => setShowEditor(!showEditor)}
        style={{
          padding: "6px 12px",
          background: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginRight: 8,
        }}
      >
        Код
      </button>

      <button
        onClick={deleteNode}
        style={{
          padding: "6px 12px",
          background: "#e24a4a",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Удалить
      </button>
      {showEditor && (
        <Editor
          width="360px"
          height="300px"
          defaultLanguage={language}
          language={language}
          value={node.data.code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      )}
    </div>
  );
}