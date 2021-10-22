export class MessageFile {
    name: string;
    type: string;
    result: string;

    constructor(name: string, type: string, result: string) {
        this.name = name;
        this.type = type;
        this.result = result;

        if (type === 'text/plain') {
            this.result = '/assets/file_icon.png';
        }
    }
}