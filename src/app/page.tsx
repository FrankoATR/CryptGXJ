'use client'

import { useState } from 'react'

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [delimiter, setDelimiter] = useState(';')
  const [key, setKey] = useState('')
  const [format, setFormat] = useState<'json' | 'xml'>('json')
  const [result, setResult] = useState<string>('')

  const handleSubmit = async () => {
    if (!file || !key) {
      alert('Por favor selecciona un archivo, un delimitador y una clave.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('delimiter', delimiter)
    formData.append('key', key)
    formData.append('format', format)

    const res = await fetch('/api/file/create', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      // Si es JSON, lo formateamos; si es XML, lo mostramos directamente
      const formatted = format === 'json'
        ? JSON.stringify(data.data, null, 2)
        : data.data
      setResult(formatted)
    } else {
      setResult(`Error: ${data.error}`)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Convertir Archivo a JSON o XML Cifrado</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Seleccionar archivo:</label>
        <input type="file" accept=".txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Delimitador:</label>
        <input
          className="border rounded p-1 w-full"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Clave de cifrado:</label>
        <input
          className="border rounded p-1 w-full"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Formato de salida:</label>
        <select
          className="border rounded p-1 w-full"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'json' | 'xml')}
        >
          <option value="json">JSON</option>
          <option value="xml">XML</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Convertir
      </button>

      <div className="mt-6">
        <label className="block mb-1 font-medium">Resultado:</label>
        <textarea
          className="border rounded w-full h-60 p-2 font-mono"
          readOnly
          value={result}
        ></textarea>
      </div>
    </div>
  )
}
