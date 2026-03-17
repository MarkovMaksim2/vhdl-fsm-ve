import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import type { NodeProps } from "reactflow";

type StateNodeData = {
  label: string;
  code?: string;
};

function StateNodeComponent({ data, selected, dragging }: NodeProps<StateNodeData>) {
  return (
    <>
      {/* Добавляем возможность изменения размера, если нужно */}
      {selected && <NodeResizer minWidth={100} minHeight={50} />}
      
      <div
        style={{
          width: "100%",
          height: "100%",
          minWidth: 120,
          minHeight: 60,
          background: "#1e1e2f",
          color: "white",
          padding: "10px",
          borderRadius: "12px",
          border: selected ? "3px solid #00bfff" : "3px solid transparent",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          userSelect: "none",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        <div style={{ fontWeight: "bold" }}>{data.label}</div>
        <div style={{ fontSize: "12px", marginTop: "6px", opacity: 0.7 }}>
          {data.code || "no logic"}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          style={{ background: "#555", width: 8, height: 8 }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555", width: 8, height: 8 }}
        />
      </div>
    </>
  );
}

// Используем memo для оптимизации производительности
export const StateNode = memo(StateNodeComponent);