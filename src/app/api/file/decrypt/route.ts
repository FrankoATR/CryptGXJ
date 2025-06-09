import { FileInputJSONDecryptRequestDTO } from '@/dtos/file/file-input-json-decrypt-request'
import { FileInputXMLDecryptRequestDTO } from '@/dtos/file/file-input-xml-decrypt-request'
import { GeneralResponse } from '@/lib/generalResponse'
import { fileServiceImp } from '@/services/implementations/fileServiceImp'
import { NextRequest } from 'next/server'

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

      if (!result) {
        return GeneralResponse({
          success: false,
          message: "Wrong key.",
          data: null
        })
      }

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

      if (!result) {
        return GeneralResponse({
          success: false,
          message: "Wrong key.",
          data: null
        })
      }

      return GeneralResponse({
        success: true,
        message: "XML file decrypted successfully.",
        data: result.result
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return GeneralResponse({
      success: false,
      message: "Server Error.",
    }, 500, { logError: true })
  }
}
