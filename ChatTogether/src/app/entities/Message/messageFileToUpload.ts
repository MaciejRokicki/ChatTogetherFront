export class MessageFileToUpload {
    name: string;
    type: string;
    size: number;
    result: string;

    constructor(name: string, type: string, size:number, result: string) {
        this.name = name;
        this.type = type;
        this.size = size;
        this.result = result;
    }
}