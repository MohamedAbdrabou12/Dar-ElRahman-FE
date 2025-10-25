export interface BaseAuditModel {
  createdAt?: string; // Optional, format: TIMESTAMP
  createdBy?: string; // Optional
  updatedAt?: string; // Optional, format: TIMESTAMP
  updatedBy?: string; // Optional
}
``