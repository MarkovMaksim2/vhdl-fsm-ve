import Editor from "@monaco-editor/react";
import type { ModuleConfig, Port } from "../module/types";
import type { Node, Edge } from "reactflow";
import { useRef } from "react";

export function ModuleSidebar({
  config,
  setConfig,
  nodes,
  setNodes,
  edges,
  setEdges,
}: {
  config: ModuleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModuleConfig>>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof ModuleConfig, value: any) => {
    setConfig((c) => ({ ...c, [field]: value }));
  };

  const updatePort = (
    type: "inputs" | "outputs",
    index: number,
    field: keyof Port,
    value: string
  ) => {
    setConfig((c) => {
      const updated = [...c[type]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...c, [type]: updated };
    });
  };

  const addPort = (type: "inputs" | "outputs") => {
    setConfig((c) => ({
      ...c,
      [type]: [...c[type], { name: "", width: "" }],
    }));
  };

  const removePort = (type: "inputs" | "outputs", index: number) => {
    setConfig((c) => ({
      ...c,
      [type]: c[type].filter((_, i) => i !== index),
    }));
  };

  const exportJSON = () => {
    const filename = prompt("Введите имя файла для экспорта:", config.name || "module");
    if (!filename) return;
    const nameWithExt = filename.endsWith(".json") ? filename : `${filename}.json`;

    const dataStr = JSON.stringify(
      { ...config, nodes: nodes || [], edges: edges || [] },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nameWithExt;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const { nodes: importedNodes, edges: importedEdges, ...restConfig } = json;
        setConfig((prev) => ({ ...prev, ...restConfig }));
        if (importedNodes) setNodes(importedNodes);
        if (importedEdges) setEdges(importedEdges);
      } catch {
        alert("Ошибка при чтении JSON");
      }
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ padding: 10 }}>
      <h3>Модуль</h3>

      {/* имя */}
      <input
        value={config.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Имя модуля"
        style={{ width: "100%", marginBottom: 8 }}
      />

      {/* clk/reset */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={config.clock}
          onChange={(e) => updateField("clock", e.target.value)}
          placeholder="clk"
        />
        <input
          value={config.reset}
          onChange={(e) => updateField("reset", e.target.value)}
          placeholder="rst"
        />
      </div>

      {/* INPUTS */}
      <h4>Inputs</h4>
      {config.inputs.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <input
            placeholder="name"
            value={p.name}
            onChange={(e) => updatePort("inputs", i, "name", e.target.value)}
          />
          <input
            placeholder="[7:0]"
            value={p.width}
            onChange={(e) => updatePort("inputs", i, "width", e.target.value)}
          />
          <button onClick={() => removePort("inputs", i)}>✕</button>
        </div>
      ))}
      <button onClick={() => addPort("inputs")}>+ input</button>

      {/* OUTPUTS */}
      <h4>Outputs</h4>
      {config.outputs.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <input
            placeholder="name"
            value={p.name}
            onChange={(e) => updatePort("outputs", i, "name", e.target.value)}
          />
          <input
            placeholder="[7:0]"
            value={p.width}
            onChange={(e) => updatePort("outputs", i, "width", e.target.value)}
          />
          <button onClick={() => removePort("outputs", i)}>✕</button>
        </div>
      ))}
      <button onClick={() => addPort("outputs")}>+ output</button>

      {/* REGISTERS */}
      <h4>Regs</h4>
      <Editor
        height="120px"
        defaultLanguage="verilog"
        value={config.regs}
        onChange={(v) => updateField("regs", v || "")}
        theme="vs-dark"
      />

      {/* WIRES */}
      <h4>Wires</h4>
      <Editor
        height="120px"
        defaultLanguage="verilog"
        value={config.wires}
        onChange={(v) => updateField("wires", v || "")}
        theme="vs-dark"
      />

      {/* PRE-INIT */}
      <h4>Pre-init</h4>
      <Editor
        height="120px"
        defaultLanguage="verilog"
        value={config.preInit || ""}
        onChange={(v) => updateField("preInit", v || "")}
        theme="vs-dark"
      />

      {/* Export/Import кнопки полностью одинаковые */}
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button
          onClick={exportJSON}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Export JSON
        </button>

        <button
          onClick={handleImportClick}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Import JSON
        </button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={importJSON}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}