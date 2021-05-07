export class Room {

    public Id: number;
    public Name: string;
    public CurrentPeople: number;
    public MaxPeople: number;

    public Occupancy : string;

    constructor(
        id: number,
        name: string,
        currentPeople : number,
        maxPeople : number
    ) {
        this.Id = id;
        this.Name = name;
        this.CurrentPeople = currentPeople;
        this.MaxPeople = maxPeople;

        this.Occupancy = currentPeople + '/' + maxPeople;
    }

}