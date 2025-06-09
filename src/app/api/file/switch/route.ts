import { FileJSONRequestDTO } from '@/dtos/file/file-json-request'
import { FileXMLRequestDTO } from '@/dtos/file/file-xml-request'
import { GeneralResponse } from '@/lib/generalResponse'
import { fileServiceImp } from '@/services/implementations/fileServiceImp'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const fromFormat = formData.get('fromFormat')?.toString()?.toLowerCase()

        if (!file || !fromFormat || !['json', 'xml'].includes(fromFormat)) {
            return GeneralResponse({
                success: false,
                message: "File, key and format (json or xml) are required",
            }, 400, { logError: true })
        }

        const fileContent = await file.text()
        const service = new fileServiceImp()

        if (fromFormat === 'xml') {
            const dto: FileXMLRequestDTO = {
                data: fileContent
            }
            const result = service.convertXMLToJSON(dto)
            return GeneralResponse({
                success: true,
                message: "Successful switch XML -> JSON.",
                data: result.result
            })
        } else {
            const parsed = JSON.parse(fileContent)
            const dto: FileJSONRequestDTO = {
                data: parsed
            }
            const result = service.convertJSONToXML(dto)
            return GeneralResponse({
                success: true,
                message: "Successful switch de JSON -> XML.",
                data: result.result
            })
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return GeneralResponse({
            success: false,
            message: "Server error.",
        }, 500, { logError: true })
    }
}
