export type AccessStatus = 'pending' | 'active' | 'expired' | 'revoked';
export type AccessDuration = '1h' | 'full' | 'revoked';

export interface AccessRecord {
    id: string;
    clinicName: string;
    clinicAddress?: string;
    requestDate: Date;
    status: AccessStatus;
    duration?: AccessDuration;
    expiryDate?: Date;
    doctorName?: string;
    clinicLogo?: string;
}
