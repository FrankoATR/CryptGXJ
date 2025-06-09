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

export default function SwitchConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fromFormat, setFromFormat] = useState<"json" | "xml" | null>(null);
  const [toFormat, setToFormat] = useState<"json" | "xml">("json");
  const [originalFile, setOriginalFile] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const router = useRouter();

  const detectFormatFromFile = (filename: string): "json" | "xml" | null => {
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".xml")) return "xml";
    return null;
  };

  const handleFileChange = async (f: File | null) => {
    if (!f) {
      setFile(null);
      setFromFormat(null);
      setOriginalFile("");
      return;
    }

    setFile(f);
    const content = await f.text();
    setOriginalFile(content);

    const detected = detectFormatFromFile(f.name);
    setFromFormat(detected);
    setToFormat(detected === "json" ? "xml" : "json");
    setResult("");
  };

  const handleSubmit = async () => {
    if (!file || !fromFormat) {
      alert("Por favor selecciona un archivo .json o .xml válido.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fromFormat", fromFormat);

    const res = await fetch("/api/file/switch", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      const formatted =
        toFormat === "json" ? JSON.stringify(data.data, null, 2) : data.data;
      setResult(formatted);
    } else {
      setResult(`Error: ${data.error}`);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], {
      type: toFormat === "json" ? "application/json" : "application/xml",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = toFormat === "json" ? "convertido.json" : "convertido.xml";
    a.click();
    URL.revokeObjectURL(url);
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
          Convertir entre JSON y XML
        </h1>

        <div className="mb-4 w-full">
          <Label htmlFor="file" className="mb-1 block font-medium">
            Seleccionar archivo (.json o .xml):
          </Label>
          <Input
            id="file"
            type="file"
            accept=".json,.xml"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="cursor-pointer file:bg-[#548075] file:text-white file:border-0 file:rounded file:px-4 file:py-2"
          />
        </div>

        <div className="mb-4 w-full">
          <Label htmlFor="format" className="mb-1 block font-medium">
            Convertir a:
          </Label>
          <Select
            value={toFormat}
            disabled
          >
            <SelectTrigger id="format" className="w-full">
              {toFormat.toUpperCase()}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="mt-10 w-3/4 bg-[#6FAB9C] text-white px-4 py-2 rounded hover:bg-[#6FAB9C]/70 cursor-pointer font-mono disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!file || !fromFormat}
        >
          CONVERTIR
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <Label className="block font-mono font-semibold mb-2 text-lg">
          ORIGINAL:
        </Label>
        <textarea
          className="border rounded w-full h-1/3 p-2 font-mono resize-y mb-4"
          readOnly
          value={originalFile}
        />
        <Label className="block font-mono font-semibold mb-2 text-lg">
          RESULTADO:
        </Label>
        <textarea
          className="border rounded w-full h-1/3 p-2 font-mono resize-y"
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
