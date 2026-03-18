import { useState, useCallback } from "react";
import type { Node, Edge, Connection } from "reactflow";
import { addEdge } from "reactflow";
import type { ModuleConfig } from "../components/module/types";

export function useFlow() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      position: { x: 200, y: 150 },
      type: "state",
      data: { label: "IDLE", code: "out = 0" },
      draggable: true,
      selectable: true,
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig>({
    name: "my_module",
    clock: "clk_i",
    reset: "rst_i",
    inputs: [],
    outputs: [],
    regs: "",
    wires: "",
  });

  const onConnect = useCallback(
  (params: Connection) => {
    const newEdge = { ...params, id: `${params.source}-${params.target}`, data: { condition: '' } };
    setEdges((eds) => addEdge(newEdge, eds));
  },
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
        data: { label: `S${id}`, code: "" },
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
    setNodes: setNodes as React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: setEdges as React.Dispatch<React.SetStateAction<Edge[]>>,
    onConnect, 
    addNode,
    selectedNode,
    setSelectedNode,
    selectedEdge,
    setSelectedEdge,
    moduleConfig,
    setModuleConfig
  };
}