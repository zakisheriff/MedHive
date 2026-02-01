import { AccessRecord } from '../types/access';

export function generateMockAccess(): AccessRecord[] {
    const now = new Date();

    return [
        {
            id: 'req_1',
            clinicName: 'City Medical Center',
            doctorName: 'Dr. Sarah Wilson',
            clinicAddress: '123 Health Ave, New York',
            requestDate: new Date(now.getTime() - 10 * 60 * 1000), // 10 mins ago
            status: 'pending',
        },
        {
            id: 'req_2',
            clinicName: 'Health Diagnostics Lab',
            doctorName: 'Dr. Michael Chen',
            clinicAddress: '456 Lab Lane, New York',
            requestDate: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            status: 'active',
            duration: 'full',
            expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        {
            id: 'req_3',
            clinicName: 'Endocrine Care Clinic',
            doctorName: 'Dr. Jane Smith',
            clinicAddress: '789 Gland Blvd, New York',
            requestDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
            status: 'active',
            duration: '1h',
            expiryDate: new Date(now.getTime() + 15 * 60 * 1000), // 15 mins remaining
        }
    ];
}
