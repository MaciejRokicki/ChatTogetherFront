export class MessageFileToUpload {
    name: string;
    type: string;
    result: string;

    constructor(name: string, type: string, result: string) {
        this.name = name;
        this.type = type;
        this.result = result;
    }
}