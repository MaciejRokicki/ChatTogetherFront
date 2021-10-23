import { Guid } from "guid-typescript";

export interface MessageFile {
    id: number;
    messageId: Guid;
    fileName: string;
    type: string;
    sourceName: string;
    thumbnailName: string;
}