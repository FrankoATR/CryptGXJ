import { NextRequest, NextResponse } from 'next/server'
import { fileServiceImp } from '@/services/implementations/fileServiceImp'
import { FileCreateByFileRequestDTO } from '@/dtos/file/file-create-by-file-request'
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
                message: "Archivo, clave y formato (json o xml) son requeridos",
            }, 400, { logError: true })
        }

        const fileContent = await file.text()

        const dto: FileCreateByFileRequestDTO = {
            fileContent,
            delimiter,
            key
        }

        const service = new fileServiceImp()

        if (format === 'json') {
            const result = service.convertDelimitedTextToJSON(dto)
            return GeneralResponse({
                success: true,
                message: "Archivo JSON creado exitosamente.",
                data: result.result
            })
        } else {
            const result = service.convertDelimitedTextToXML(dto)
            return GeneralResponse({
                success: true,
                message: "Archivo XML creado exitosamente.",
                data: result.result
            })
        }
    } catch (error) {
        return GeneralResponse({
            success: false,
            message: "Error del servidor",
        }, 500, { logError: true })
    }
}
