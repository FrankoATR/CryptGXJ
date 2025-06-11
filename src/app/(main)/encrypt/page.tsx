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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [delimiter, setDelimiter] = useState(";");
  const [key, setKey] = useState("");
  const [format, setFormat] = useState<"json" | "xml">("json");
  const [result, setResult] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-w-5xl min-h-screen mx-auto bg-white shadow-2xl rounded-lg font-mono">
        <div className="w-full md:border-r md:pr-6 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#548075]">
            <ArrowLeft
              className="inline mr-2 cursor-pointer"
              onClick={() => router.back()}
            />
            Convertir Archivo a JSON o XML Cifrado
          </h1>

          <div className="mb-4 w-full">
            <Label htmlFor="file" className="mb-1 block font-medium">
              Seleccionar Archivo (.txt):
            </Label>
            <Input
              id="file"
              type="file"
              accept=".txt"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);
                setResult("");
                if (selectedFile) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    setOriginalContent(text);
                  };
                  reader.readAsText(selectedFile);
                } else {
                  setOriginalContent("");
                }
              }}
              className="cursor-pointer  file:bg-[#548075] file:text-white file:border-0 file:rounded file:px-4 file:py-2"
            />
          </div>

          <div className="mb-4 w-full">
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

          <div className="mb-4 w-full">
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

          <div className="mb-4 w-full">
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
            className="mt-10 w-full md:w-3/4 bg-[#6FAB9C] text-white px-4 py-2 rounded hover:bg-[#6FAB9C]/70 cursor-pointer font-mono"
            onClick={handleSubmit}
          >
            CONVERTIR
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          {originalContent && (
            <div className="mb-4 p-2 border rounded bg-gray-100 text-sm w-full max-h-40 overflow-y-auto whitespace-pre-wrap">
              <strong>Contenido original:</strong>
              <pre>{originalContent}</pre>
            </div>
          )}
          <Label className="block font-mono font-semibold mb-5 text-2xl">
            RESULTADO:
          </Label>
          <textarea
            className="border rounded w-full h-40 md:h-3/5 p-2 font-mono resize-y"
            readOnly
            value={result}
          />
          {result && (
            <Button
              className="mt-6 font-mono w-full md:w-3/4 bg-[#39574F] text-white px-4 py-2 rounded hover:bg-[#39574F]/70 cursor-pointer"
              onClick={() => handleDownload()}
            >
              DESCARGAR ARCHIVO
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
