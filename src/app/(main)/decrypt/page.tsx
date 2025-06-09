"use client";

import { useState } from "react";
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

export default function DecryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [delimiter, setDelimiter] = useState(";");
  const [key, setKey] = useState("");
  const [format, setFormat] = useState<"json" | "xml">("json");
  const [result, setResult] = useState<string>("");
  const router = useRouter();

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

    const res = await fetch("/api/file/decrypt", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setResult(data.data); // texto plano
    } else {
      setResult(`Error: ${data.error}`);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "archivo-desencriptado.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const detectFormatFromFile = (filename: string): "json" | "xml" | null => {
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".xml")) return "xml";
    return null;
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-6 max-w-5xl h-screen mx-auto bg-white shadow-2xl rounded-lg font-mono">
      <div className="border-r pr-6 flex flex-col justify-center items-center">
        <h1
          className="text-2xl font-bold mb-4 text-center text-[#548075]"
          onClick={() => window.history.back()}
        >
          <ArrowLeft
            className="inline mr-2 cursor-pointer"
            onClick={() => router.back()}
          />
          Desencriptar JSON o XML a archivo .txt
        </h1>

        <div className="mb-4 w-full">
          <Label htmlFor="file" className="mb-1 block font-medium">
            Seleccionar archivo (.json o .xml):
          </Label>
          <Input
            id="file"
            type="file"
            accept=".json,.xml"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);

              if (selectedFile) {
                const detected = detectFormatFromFile(selectedFile.name);
                if (detected) {
                  setFormat(detected);
                  setResult("");
                } else {
                  alert("Solo se permiten archivos .json o .xml");
                  setFile(null);
                  setFormat("json");
                }
              }
            }}
            className="cursor-pointer file:bg-[#548075] file:text-white file:border-0 file:rounded file:px-4 file:py-2"
          />
        </div>

        <div className="mb-4 w-full">
          <Label htmlFor="delimiter" className="mb-1 block font-medium">
            Delimitador de salida:
          </Label>
          <Input
            id="delimiter"
            type="text"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
          />
        </div>

        <div className="mb-4 w-full">
          <Label htmlFor="key" className="mb-1 block font-medium">
            Clave de desencriptado:
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
            Formato de entrada:
          </Label>
          <Select
            value={format}
            onValueChange={(value) => {
              setFormat(value as "json" | "xml");
              setResult("");
            }}

            disabled
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
          className="mt-10 w-3/4 bg-[#6FAB9C] text-white px-4 py-2 rounded hover:bg-[#6FAB9C]/70 cursor-pointer font-mono"
          onClick={handleSubmit}
        >
          DESENCRIPTAR
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <Label className="block font-mono font-semibold mb-5 text-2xl">
          RESULTADO:
        </Label>
        <textarea
          className="border rounded w-full h-3/5 p-2 font-mono resize-y"
          readOnly
          value={result}
        />
        {result && (
          <Button
            className="mt-6 font-mono w-3/4 bg-[#39574F] text-white px-4 py-2 rounded hover:bg-[#39574F]/70 cursor-pointer"
            onClick={handleDownload}
          >
            DESCARGAR ARCHIVO
          </Button>
        )}
      </div>
    </div>
  );
}
