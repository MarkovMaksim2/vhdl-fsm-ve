import React, { useRef } from "react";
import ReactFlow, { Background, Controls, useReactFlow } from "reactflow";
import type { Node, Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import { StateNode } from "./nodes/StateNode";

const nodeTypes = { state: StateNode };

export function FlowCanvas({
  nodes,
  edges,
  onConnect,
  addNode,
}: {
  nodes: Node[];
  edges: Edge[];
  onConnect: (c: Connection) => void;
  addNode: (pos?: { x: number; y: number }) => void;
}) {
  const projectRef = useRef<(p: { x: number; y: number }) => { x: number; y: number }>(null);
  // const { project } = useReactFlow();

  const onPaneClick = (event: React.MouseEvent) => {
    try {
      if (!projectRef.current) {
        console.warn("Project function not ready yet");
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const position = projectRef.current({ x, y });
      
      if (!position) {
        console.warn("Position calculation failed", x, y);
        return;
      }
      console.warn("Position: ", position.x, position.y);
      
      addNode({
        x: position.x - 60,
        y: position.y - 25,
      });
    } catch (err) {
      console.error("Error adding node:", err);
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onPaneClick={onPaneClick}
      fitView
      onInit={(reactFlowInstance) => {
        projectRef.current = reactFlowInstance.project;
      }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}