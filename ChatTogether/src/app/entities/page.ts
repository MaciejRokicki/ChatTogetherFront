export class Page<T> {
    public currentPage: number;
    public pageSize: number;
    public pageCount: number;
    public count: number;
    public data: T[];
} 