import { NextRequest, NextResponse } from 'next/server'
import { fileServiceImp } from '@/services/implementations/fileServiceImp'
import { FileInputJSONDecryptRequestDTO } from '@/dtos/file/file-input-json-decrypt-request'
import { FileInputXMLDecryptRequestDTO } from '@/dtos/file/file-input-xml-decrypt-request'
import { GeneralResponse } from '@/lib/generalResponse'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const delimiter = formData.get('delimiter')?.toString() || ';'
    const key = formData.get('key')?.toString() || ''
    const format = formData.get('format')?.toString()?.toLowerCase()

    if (!file || !key || !format || !['json', 'xml'].includes(format)) {
      return GeneralResponse({
        success: false,
        message: "File, key and format (json or xml) are required.",
      }, 400, { logError: true })
    }

    const fileContent = await file.text()
    const service = new fileServiceImp()

    if (format === 'json') {
      const jsonData = JSON.parse(fileContent)

      const dto: FileInputJSONDecryptRequestDTO = {
        data: jsonData,
        delimiter,
        key
      }

      const result = service.convertJSONToDelimitedText(dto)
      return GeneralResponse({
        success: true,
        message: "JSON file decrypted successfully.",
        data: result.result
      })
    } else {
      const dto: FileInputXMLDecryptRequestDTO = {
        data: fileContent,
        delimiter,
        key
      }

      const result = service.convertXMLToDelimitedText(dto)
      return GeneralResponse({
        success: true,
        message: "XML file decrypted successfully.",
        data: result.result
      })
    }
  } catch (error) {
    return GeneralResponse({
      success: false,
      message: "Server Error.",
    }, 500, { logError: true })
  }
}
