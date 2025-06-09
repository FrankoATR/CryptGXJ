"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [delimiter, setDelimiter] = useState(";");
  const [key, setKey] = useState("");
  const [format, setFormat] = useState<"json" | "xml">("json");
  const [result, setResult] = useState<string>("");

  const handleSubmit = async () => {
    if (!file || !key) {
      alert("Por favor selecciona un archivo, un delimitador y una clave.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("delimiter", delimiter);
    formData.append("key", key);
    formData.append("format", format);

    const res = await fetch("/api/file/encrypt", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      // Si es JSON, lo formateamos; si es XML, lo mostramos directamente
      const formatted =
        format === "json" ? JSON.stringify(data.data, null, 2) : data.data;
      setResult(formatted);
    } else {
      setResult(`Error: ${data.error}`);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], {
      type: format === "json" ? "application/json" : "application/xml",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "json" ? "archivo.json" : "archivo.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-2xl m-5 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#548075]">
        Convertir Archivo a JSON o XML Cifrado
      </h1>

      <div className="mb-4">
        <Label htmlFor="file" className="mb-1 block font-medium">
          Seleccionar Archivo (.txt):
        </Label>
        <Input
          id="file"
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="cursor-pointer  file:bg-[#548075] file:text-white file:border-0 file:rounded file:px-4 file:py-2"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="file" className="mb-1 block font-medium">
          Delimitador
        </Label>
        <Input
          id="Delimitador"
          type="text"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="file" className="mb-1 block font-medium">
          Clave de Cifrado:
        </Label>
        <Input
          id="key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="format" className="mb-1 block font-medium">
          Formato de Salida:
        </Label>
        <Select
          value={format}
          onValueChange={(value) => {
            setFormat(value as "json" | "xml");
            setResult("");
          }}
        >
          <SelectTrigger id="format" className="w-full">
            {format.toUpperCase()}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="bg-[#6FAB9C] text-white px-4 py-2 rounded hover:bg-[#6FAB9C]/70 cursor-pointer"
        onClick={handleSubmit}
      >
        Convertir
      </Button>

      <div className="mt-6">
        <Label className="block mb-1 font-medium">Resultado:</Label>
        <textarea
          className="border rounded w-full h-60 p-2 font-mono resize-y"
          readOnly
          value={result}
        />
        {result && (
          <Button
            className="mt-4 bg-[#39574F] text-white px-4 py-2 rounded hover:bg-[#39574F]/70 cursor-pointer"
            onClick={() => handleDownload()}
          >
            Descargar Archivo
          </Button>
        )}
      </div>
    </div>
  );
}
