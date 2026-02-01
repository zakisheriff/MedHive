export type HistoryItemType = 'prescription' | 'labReport';

export interface Medicine {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

export interface LabTest {
    name: string;
    value: string;
    unit: string;
    status: 'normal' | 'abnormal' | 'critical';
    referenceRange?: string;
}

export interface HistoryItem {
    id: string;
    type: HistoryItemType;
    title: string;
    date: Date;
    clinicName?: string;
    medicines?: Medicine[];
    labTests?: LabTest[];
    imageUri?: string;
    notes?: string;
    status: 'active' | 'completed' | 'expired';
}

export interface MonthGroup {
    monthLabel: string;
    items: HistoryItem[];
}

export interface YearGroup {
    year: number;
    months: MonthGroup[];
}
