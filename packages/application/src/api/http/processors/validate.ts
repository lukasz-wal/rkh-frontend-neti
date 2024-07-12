import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from "express-validator";

import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";

const validators = {
  createAllocation: [
    body("candidateId").isString(),
    body("additionalData").optional().isObject(),
  ],
  startPhase: [
    param("allocatorId").isString(),
    param("phase").isIn(Object.values(DatacapAllocatorPhase)),
  ],
  completePhase: [
    param("allocatorId").isString(),
    param("phase").isIn(Object.values(DatacapAllocatorPhase)),
    body("result").isIn(["approved", "rejected"]),
    body("comments").optional().isString(),
  ],
  updateKYC: [
    param("allocatorId").isString(),
    body("kycData").isObject(),
  ],
  submitGovernanceReview: [
    param("allocatorId").isString(),
    body("reviewerId").isString(),
    body("reviewData").isObject(),
  ],
  updateRKHApproval: [
    param("allocatorId").isString(),
    body("approvalData").isObject(),
  ],
  grantDatacap: [
    param("allocatorId").isString(),
    body("amount").isNumeric(),
    body("grantDetails").isObject(),
  ]
};

export const validateRequest = (validatorKey: keyof typeof validators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validators[validatorKey].map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });
  };
};