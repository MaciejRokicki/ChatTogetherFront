export class BlockedUser {
    public userId: number;
    public email: string;
    public nickname: string;
    public firstName: string;
    public lastName: string;
    public reason: string;
    public blockedTo: Date;
    public created: Date;
    public createdByEmail: string;
    public createdByNickname: string;
}