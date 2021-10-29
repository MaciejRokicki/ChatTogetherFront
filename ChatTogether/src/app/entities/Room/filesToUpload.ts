import { MessageFileToUpload } from "../Message/messageFileToUpload";

export class FilesToUpload {
    files: MessageFileToUpload[];
    totalSize: number;
  
    constructor() {
      this.clear();
    }
  
    clear(): void {
      this.files = [];
      this.totalSize = 0;
    }
  }