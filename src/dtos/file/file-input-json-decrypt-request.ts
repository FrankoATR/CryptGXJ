import { FileClientStruct } from "./file-client-struct"

export interface FileInputJSONDecryptRequestDTO
{
  data: FileClientStruct[]
  delimiter: string
  key: string
}