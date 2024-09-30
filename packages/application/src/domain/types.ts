type KYCResultData = {
  // IDs
  id: string
  kycInquiryId: string

  // Metadata
  createdAt: string
  tenantId: string
  documentId: string
  documentType: string
  platform: string
  browser: string

  // Scores
  scoreDocumentTotal: number
  scoreBiometricLifeProof: number
  scoreBiometricSelfie: number
  scoreBiometricPhotoId: number
  scoreBiometricDuplicateAttack: number

  // Other
  processCode: string
  processMessage: string
}

export type KYCApprovedData = KYCResultData
export type KYCRejectedData = KYCApprovedData
