import { FileEncryptDTO } from "@/dtos/file/file-encrypt-request";
import { FileJSONResponseDTO } from "@/dtos/file/file-json-response";
import { FileXMLRequestDTO } from "@/dtos/file/file-xml-request";
import { FileXMLResponseDTO } from "@/dtos/file/file-xml-response";
import { FileJSONRequestDTO } from "@/dtos/file/file-json-request";
import { FileDecryptResponseDTO } from "@/dtos/file/file-decrypt-response";

export interface fileServiceInt
{
    convertDelimitedTextToJSON(dto: FileEncryptDTO): FileJSONResponseDTO
    convertDelimitedTextToXML(dto: FileEncryptDTO): FileXMLResponseDTO
    convertJSONToDelimitedText(dto: FileJSONRequestDTO): FileDecryptResponseDTO
    convertXMLToDelimitedText(dto: FileXMLRequestDTO): FileDecryptResponseDTO
    convertXMLToJSON(dto: FileXMLRequestDTO): FileJSONResponseDTO
    convertJSONToXML(dto: FileJSONRequestDTO): FileXMLResponseDTO
}