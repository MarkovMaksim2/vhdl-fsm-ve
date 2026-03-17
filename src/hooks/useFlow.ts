import { useState, useCallback } from "react";
import type { Node, Edge, Connection } from "reactflow";
import { addEdge } from "reactflow";

export function useFlow() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      position: { x: 200, y: 150 },
      type: "state",
      data: { label: "IDLE", code: "out = 0" },
      // Явно указываем эти свойства для надежности
      draggable: true,
      selectable: true,
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = useCallback(
    (position?: { x: number; y: number }) => {
      const id = (nodes.length + 1).toString();
      const newNode: Node = {
        id,
        type: "state",
        position: position || { 
          x: 250 + nodes.length * 20, 
          y: 150 + nodes.length * 20 
        },
        data: { label: `State ${id}`, code: "out = 0" },
        draggable: true,
        selectable: true,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length]
  );

  return { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    onConnect, 
    addNode 
  };
}