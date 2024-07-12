export class GetDatacapAllocatorsQuery {
    page;
    limit;
    status;
    constructor(page = 1, limit = 10, status) {
        this.page = page;
        this.limit = limit;
        this.status = status;
    }
}
