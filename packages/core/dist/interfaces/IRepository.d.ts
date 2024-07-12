export interface IRepository<T> {
    save(aggregateRoot: T, expectedVersion: number): void;
    getById(guid: string): Promise<T>;
}
//# sourceMappingURL=IRepository.d.ts.map