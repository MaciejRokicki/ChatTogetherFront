import { Room } from "../entities/room";
import { Observable } from 'rxjs';

export class RoomService {

    allRooms: Observable<Room[]> = new Observable(sub => {
        let rooms: Room[] = []

        for(let i = 1; i < 32; i++)
        {
            let maxPeople : number = (Math.random() * (50-5 + 1)) + 5;
            let currentPeople : number = (Math.random() * (maxPeople - 0 + 1)) + 0;

            rooms.push(
                {
                    id: i,
                    name: `Pokój ${i}`,
                    currentPeople: Math.floor(currentPeople),
                    maxPeople: Math.floor(maxPeople)
                });
        }

        sub.next(rooms);
    });

    getRooms(): Observable<Room[]> {
        return this.allRooms;
    }
}