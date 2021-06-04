export class User {

    public Id: number;
    public Nickname: string;
    public Email: string;

    constructor(
        id: number,
        nickname: string,
        email : string,
    ) {
        this.Id = id;
        this.Nickname = nickname;
        this.Email = email;
    }

}