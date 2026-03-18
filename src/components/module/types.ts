import type { Node, Edge } from "reactflow";

export type Port = {
  name: string;
  width: string;
};

export type ModuleConfig = {
  name: string;

  inputs: Port[];
  outputs: Port[];

  regs: string;
  wires: string;
  preInit?: string;

  clock: string;
  reset: string;

  nodes: Node[];
  edges: Edge[];
};