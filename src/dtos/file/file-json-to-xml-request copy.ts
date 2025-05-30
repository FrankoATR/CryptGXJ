import { FileClientStruct } from "./file-client-struct"

export interface FileJSONToXMLRequestDTO
{
  data: FileClientStruct[]
  key: string
}