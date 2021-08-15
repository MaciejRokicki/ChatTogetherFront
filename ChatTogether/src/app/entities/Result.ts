export enum ResultStage {
    INITIAL,
    WAITING,
    SUCCESS,
    ERROR
}

export class Result {
    constructor(
        public Stage: ResultStage,
        public Message: string | undefined
    ) {}
}