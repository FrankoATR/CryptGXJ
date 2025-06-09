'use client'

import { useState } from 'react'

export default function SwitchConvertPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fromFormat, setFromFormat] = useState<'json' | 'xml' | null>(null)
  const [toFormat, setToFormat] = useState<'json' | 'xml'>('json')
  const [originalFile, setOriginalFile] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const detectFormatFromFile = (filename: string): 'json' | 'xml' | null => {
    if (filename.endsWith('.json')) return 'json'
    if (filename.endsWith('.xml')) return 'xml'
    return null
  }

  const handleFileChange = async (f: File | null) => {
    if (!f) {
      setFile(null)
      setFromFormat(null)
      setOriginalFile('')
      return
    }

    setFile(f)
    const content = await f.text()
    setOriginalFile(content)

    const detected = detectFormatFromFile(f.name)
    setFromFormat(detected)
    setToFormat(detected === 'json' ? 'xml' : 'json')
    setResult('')
  }

  const handleSubmit = async () => {
    if (!file || !fromFormat) {
      alert('Por favor selecciona un archivo .json o .xml válido.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fromFormat', fromFormat)

    const res = await fetch('/api/file/switch', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (res.ok) {
      const formatted = toFormat === 'json'
        ? JSON.stringify(data.data, null, 2)
        : data.data
      setResult(formatted)
    } else {
      setResult(`Error: ${data.error}`)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([result], {
      type: toFormat === 'json' ? 'application/json' : 'application/xml'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = toFormat === 'json' ? 'convertido.json' : 'convertido.xml'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 w-full mx-auto">
      <div className='p-6 max-w-xl mx-auto'>
        <h1 className="text-2xl font-bold mb-4">Convertir JSON ↔ XML</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Seleccionar archivo (.json o .xml):</label>
          <input
            type="file"
            accept=".json,.xml"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Convertir a:</label>
          <select
            className="border rounded p-1 w-full"
            value={toFormat}
            onChange={(e) => setToFormat(e.target.value as 'json' | 'xml')}
            disabled={!fromFormat}
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
          </select>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={!file || !fromFormat}
        >
          Convertir
        </button>
      </div>

      <div className="flex flex-row gap-4 mt-6">
        <div className="w-1/2">
          <label className="block mb-1 font-medium">Original:</label>
          <textarea
            className="border rounded w-full h-80 p-2 font-mono"
            readOnly
            value={originalFile}
          ></textarea>
        </div>
        <div className="w-1/2">
          <label className="block mb-1 font-medium">Resultado:</label>
          <textarea
            className="border rounded w-full h-80 p-2 font-mono"
            readOnly
            value={result}
          ></textarea>
        </div>
      </div>

      {result && (
        <div className='flex flex-row items-center justify-center'>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleDownload}
          >
            Descargar archivo
          </button>
        </div>
      )}
    </div>
  )
}
