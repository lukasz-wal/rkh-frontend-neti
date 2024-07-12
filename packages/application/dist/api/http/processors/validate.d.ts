import { Request, Response, NextFunction } from 'express';
declare const validators: {
    createAllocation: import("express-validator").ValidationChain[];
    startPhase: import("express-validator").ValidationChain[];
    completePhase: import("express-validator").ValidationChain[];
    updateKYC: import("express-validator").ValidationChain[];
    submitGovernanceReview: import("express-validator").ValidationChain[];
    updateRKHApproval: import("express-validator").ValidationChain[];
    grantDatacap: import("express-validator").ValidationChain[];
};
export declare const validateRequest: (validatorKey: keyof typeof validators) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
