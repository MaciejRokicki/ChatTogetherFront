export enum Role {
    ADMINISTRATOR = "ADMINISTRATOR",
    MODERATOR = "MODERATOR",
    USER = "USER"
}

export class User {
    constructor(
        public nickname: string,
        public firstName: string,
        public lastName: string,
        public role: string,
        public birthDate: Date,
        public city: string,
        public description: string,
        public isBlocked: boolean
    ) { }

}