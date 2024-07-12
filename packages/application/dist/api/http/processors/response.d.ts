export declare const ok: (message: string, data: any) => {
    status: string;
    message: string;
    data: any;
};
export declare const badRequest: (message: string, errors: any) => {
    status: string;
    message: string;
    errors: any;
};
