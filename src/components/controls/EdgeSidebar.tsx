import type { Edge, Node } from "reactflow";
import React from "react";
import Editor from "@monaco-editor/react";

export function EdgeSidebar(
{ 
    edge,
    nodes,
    setEdges,
    setSelectedNode,
    setSelectedEdge,
    setMode
} :
{
    edge: Edge | null;
    nodes: Node[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    setSelectedNode?: React.Dispatch<React.SetStateAction<Node | null>>;
    setSelectedEdge?: React.Dispatch<React.SetStateAction<Edge | null>>;
    setMode?: React.Dispatch<React.SetStateAction<"module" | "node" | "edge">>;
}) {
  if (!edge) return null;

  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  const handleConditionChange = (value: string | undefined) => {
    setEdges((eds) =>
      eds.map((ed) =>
        ed.id === edge.id
          ? {
              ...ed,
              data: {
                ...(ed.data || {}),
                condition: value || "",
              },
            }
          : ed
      )
    );
  };

  const deleteEdge = () => {
    setEdges((eds) => eds.filter((ed) => ed.id !== edge.id));
    setMode?.("module");
  };

  return (
    <div
      style={{
        padding: 12,
        width: 300,
        background: "#2e2e3e",
        color: "white",
        height: "100%",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Свойства</h3>

      <div style={{ marginBottom: 12 }}>
        <strong style={{ display: "block", marginBottom: 8 }}>Переход:</strong>

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 6 
        }}>
          <div
            onClick={() => {
              if (sourceNode) {
                setSelectedNode?.(sourceNode)
                setSelectedEdge?.(null)
                setMode?.("node");
              }
            }}
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
              e.currentTarget.style.borderColor = "#e24a4a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#2a2a3a";
              e.currentTarget.style.borderColor = "#3a3a4a";
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#e24a4a",
                  borderRadius: "4px 0 4px 0",
                }}
              />
              <span style={{ 
                color: "#aaa", 
                fontSize: 13,
                minWidth: 65
              }}>
                Исходное:
              </span>
              <span style={{ 
                fontWeight: 500,
                color: "#e24a4a"
              }}>
                {sourceNode?.data?.label || edge.source}
              </span>
            </div>
          </div>

          <div
            onClick={() => {
              if (targetNode) {
                setSelectedNode?.(targetNode);
                setSelectedEdge?.(null);
                setMode?.("node");
              }
            }}
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
              e.currentTarget.style.borderColor = "#4ae290";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#2a2a3a";
              e.currentTarget.style.borderColor = "#3a3a4a";
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#4ae290",
                  borderRadius: "4px 0 4px 0",
                }}
              />
              <span style={{ 
                color: "#aaa", 
                fontSize: 13,
                minWidth: 65
              }}>
                Целевое:
              </span>
              <span style={{ 
                fontWeight: 500,
                color: "#4ae290"
              }}>
                {targetNode?.data?.label || edge.target}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 10 }}>
        <h3>Код перехода</h3>

        <Editor
          width="340px"
          height="300px"
          defaultLanguage="verilog"
          value={edge.data?.code || ""}
          onChange={handleConditionChange}
          theme="vs-dark"
        />
      </div>

      <button
        onClick={deleteEdge}
        style={{
          padding: "6px 12px",
          background: "#e24a4a",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Удалить переход
      </button>
    </div>
  );
}