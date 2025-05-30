import { FileCreateByFileRequestDTO } from '@/dtos/file/file-create-by-file-request'
import { FileJSONResponseDTO } from '@/dtos/file/file-json-response'
import { FileXMLToJSONRequestDTO } from '@/dtos/file/file-xml-to-json-request'
import { fileServiceInt } from '../interfaces/fileServicesInt'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { FileClientStruct } from '@/dtos/file/file-client-struct'
import { FileXMLResponseDTO } from '@/dtos/file/file-xml-response copy'
import { FileJSONToXMLRequestDTO } from '@/dtos/file/file-json-to-xml-request copy'
import CryptoJS from 'crypto-js'

function parseLineToFileStruct(line: string, delimiter: string): FileClientStruct {
  const [name, email, creditCard] = line.split(delimiter)
  return { name, email, creditCard }
}

function encryptFileStruct(struct: FileClientStruct, key: string): FileClientStruct {
  return {
    ...struct,
    creditCard: CryptoJS.AES.encrypt(struct.creditCard, key).toString()
  }
}


export class fileServiceImp implements fileServiceInt {

  convertDelimitedTextToJSON(dto: FileCreateByFileRequestDTO): FileJSONResponseDTO {
    const lines = dto.fileContent.trim().split('\n')
    const result = lines.map(line => {
      const base = parseLineToFileStruct(line, dto.delimiter)
      const encrypted = encryptFileStruct(base, dto.key)
      return encrypted
    })

    return { result}
  }

  convertDelimitedTextToXML(dto: FileCreateByFileRequestDTO): FileXMLResponseDTO {
    const lines = dto.fileContent.trim().split('\n')
    const result = lines.map(line => {
      const base = parseLineToFileStruct(line, dto.delimiter)
      const encrypted = encryptFileStruct(base, dto.key)
      return encrypted
    })

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    })

    const xml = builder.build({ clients: { client: result } })
    return { result: xml }
  }

  convertJSONToXML(dto: FileJSONToXMLRequestDTO): FileXMLResponseDTO {
    const jsonData = dto.data

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    })

    const xml = builder.build({ clients: { client: jsonData } })

    return { result: xml }
  }


  convertXMLToJSON(dto: FileXMLToJSONRequestDTO): FileJSONResponseDTO {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: false
    })

    const parsed = parser.parse(dto.data)
    const clients = Array.isArray(parsed.clients.client)
      ? parsed.clients.client
      : [parsed.clients.client]

    return {result: clients }
  }

}
