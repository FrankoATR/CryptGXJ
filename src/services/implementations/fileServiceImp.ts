import { FileEncryptDTO } from '@/dtos/file/file-encrypt-request'
import { FileJSONResponseDTO } from '@/dtos/file/file-json-response'
import { FileXMLRequestDTO } from '@/dtos/file/file-xml-request'
import { fileServiceInt } from '../interfaces/fileServicesInt'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { FileClientStruct } from '@/dtos/file/file-client-struct'
import { FileXMLResponseDTO } from '@/dtos/file/file-xml-response'
import { FileJSONRequestDTO } from '@/dtos/file/file-json-request'
import CryptoJS from 'crypto-js'
import wellknown from 'wellknown'
import { FileDecryptResponseDTO } from '@/dtos/file/file-decrypt-response'
import { FileInputJSONDecryptRequestDTO } from '@/dtos/file/file-input-json-decrypt-request'
import { FileInputXMLDecryptRequestDTO } from '@/dtos/file/file-input-xml-decrypt-request'

function parseLineToFileStruct(line: string, delimiter: string): FileClientStruct {
  const [document, name, lastname, creditCardNumber, creditCardType, phone, polygon] = line.split(delimiter)
  return { document, name, lastname, creditCardNumber, creditCardType, phone, polygon }
}

function encryptFileStruct(struct: FileClientStruct, key: string): FileClientStruct {
  return {
    ...struct,
    creditCardNumber: CryptoJS.AES.encrypt(struct.creditCardNumber, key).toString()
  }
}


export class fileServiceImp implements fileServiceInt {
  convertDelimitedTextToJSON(dto: FileEncryptDTO): FileJSONResponseDTO {
    const lines = dto.fileContent.trim().split('\n')

    const result = lines.map(line => {
      const base = parseLineToFileStruct(line, dto.delimiter)
      const encrypted = encryptFileStruct(base, dto.key)

      return {
        ...encrypted,
        polygon: {
          type: 'FeatureCollection',
          crs: {
            type: 'name',
            properties: { name: 'EPSG:4326' }
          },
          features: [
            {
              type: 'Feature',
              geometry: wellknown.parse(base.polygon),
              properties: { Land_Use: 'T' }
            }
          ]
        }
      }

    })

    return { result }
  }

  convertDelimitedTextToXML(dto: FileEncryptDTO): FileXMLResponseDTO {
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

    const xml = builder.build({ "clients": { "client": result } })
    return { result: xml }
  }


  convertJSONToDelimitedText(dto: FileInputJSONDecryptRequestDTO): FileDecryptResponseDTO {
    const lines = dto.data.map(client => {
      const decryptedCard = CryptoJS.AES.decrypt(
        client.creditCardNumber,
        dto.key
      ).toString(CryptoJS.enc.Utf8)

      const polygon = typeof client.polygon === 'string'
        ? client.polygon
        : wellknown.stringify(client.polygon.features?.[0]?.geometry)

      return [
        client.document,
        client.name,
        client.lastname,
        decryptedCard,
        client.creditCardType,
        client.phone,
        polygon
      ].join(dto.delimiter)
    })

    return { result: lines.join('\n') }
  }


  convertXMLToDelimitedText(dto: FileInputXMLDecryptRequestDTO): FileDecryptResponseDTO {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: false
    })

    const parsed = parser.parse(dto.data)
    const clients = Array.isArray(parsed.clients.client)
      ? parsed.clients.client
      : [parsed.clients.client]

    const lines = clients.map((client: any) => {
      const decryptedCard = CryptoJS.AES.decrypt(
        client.creditCardNumber,
        dto.key
      ).toString(CryptoJS.enc.Utf8)

      const polygon = typeof client.polygon === 'string'
        ? client.polygon
        : wellknown.stringify(client.polygon?.features?.[0]?.geometry)

      return [
        client.document,
        client.name,
        client.lastname,
        decryptedCard,
        client.creditCardType,
        client.phone,
        polygon
      ].join(dto.delimiter)
    })

    return { result: lines.join('\n') }
  }

  convertJSONToXML(dto: FileJSONRequestDTO): FileXMLResponseDTO {
    const jsonData = dto.data.map(client => {
      let polygon = client.polygon

      if (typeof polygon === 'object' && polygon.features?.[0]?.geometry) {
        polygon = wellknown.stringify(polygon.features[0].geometry)
      }

      return {
        ...client,
        polygon
      }
    })

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    })

    const xml = builder.build({ clients: { client: jsonData } })

    return { result: xml }
  }


  convertXMLToJSON(dto: FileXMLRequestDTO): FileJSONResponseDTO {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: false
    })

    const parsed = parser.parse(dto.data)
    const clients = Array.isArray(parsed.clients.client)
      ? parsed.clients.client
      : [parsed.clients.client]


    const result = clients.map((client: any) => {
      const polygon = client.polygon
      return {
        ...client,
        polygon: typeof polygon === 'string'
          ? {
            type: 'FeatureCollection',
            crs: {
              type: 'name',
              properties: { name: 'EPSG:4326' }
            },
            features: [
              {
                type: 'Feature',
                geometry: wellknown.parse(polygon),
                properties: { Land_Use: 'T' }
              }
            ]
          }
          : polygon
      }
    })


    return { result }
  }

}