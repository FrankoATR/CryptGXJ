import { FileCreateByFileRequestDTO } from "@/dtos/file/file-create-by-file-request";
import { FileJSONResponseDTO } from "@/dtos/file/file-json-response";
import { FileXMLToJSONRequestDTO } from "@/dtos/file/file-xml-to-json-request";
import { FileXMLResponseDTO } from "@/dtos/file/file-xml-response copy";
import { FileJSONToXMLRequestDTO } from "@/dtos/file/file-json-to-xml-request copy";

export interface fileServiceInt
{
    convertDelimitedTextToJSON(dto: FileCreateByFileRequestDTO): FileJSONResponseDTO
    convertDelimitedTextToXML(dto: FileCreateByFileRequestDTO): FileXMLResponseDTO
    convertXMLToJSON(dto: FileXMLToJSONRequestDTO): FileJSONResponseDTO
    convertJSONToXML(dto: FileJSONToXMLRequestDTO): FileXMLResponseDTO
}