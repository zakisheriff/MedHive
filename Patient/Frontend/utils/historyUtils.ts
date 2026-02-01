import { HistoryItem, GroupedHistory, HistoryItemType } from '../types/history';
import { FilterType } from '../components/FilterChips';

export function groupHistoryByDate(items: HistoryItem[]): GroupedHistory[] {
    if (items.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const grouped: { [key: string]: HistoryItem[] } = {};
    const dateLabels: { [key: string]: string } = {};

    items.forEach((item) => {
        const itemDate = new Date(item.date);
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

        let dateKey: string;
        let dateLabel: string;

        if (itemDateOnly.getTime() === today.getTime()) {
            dateKey = 'today';
            dateLabel = 'Today';
        } else if (itemDateOnly.getTime() === yesterday.getTime()) {
            dateKey = 'yesterday';
            dateLabel = 'Yesterday';
        } else if (itemDate >= thisWeek) {
            dateKey = 'thisWeek';
            dateLabel = 'This Week';
        } else if (itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()) {
            dateKey = 'thisMonth';
            dateLabel = 'This Month';
        } else {
            dateKey = itemDateOnly.toISOString();
            dateLabel = itemDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                day: 'numeric'
            });
        }

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
            dateLabels[dateKey] = dateLabel;
        }
        grouped[dateKey].push(item);
    });

    // Sort items within each group by date (newest first)
    Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    // Convert to array and sort groups
    const result: GroupedHistory[] = Object.keys(grouped).map((key) => ({
        dateLabel: dateLabels[key],
        items: grouped[key],
    }));

    // Sort groups: today, yesterday, this week, this month, then by date
    const order: { [key: string]: number } = {
        today: 0,
        yesterday: 1,
        thisWeek: 2,
        thisMonth: 3,
    };

    result.sort((a, b) => {
        const aKey = Object.keys(grouped).find((key) => dateLabels[key] === a.dateLabel) || '';
        const bKey = Object.keys(grouped).find((key) => dateLabels[key] === b.dateLabel) || '';
        const aOrder = order[aKey] ?? 4;
        const bOrder = order[bKey] ?? 4;
        return aOrder - bOrder;
    });

    return result;
}

export function filterHistory(
    items: HistoryItem[],
    filter: FilterType,
    searchQuery: string
): HistoryItem[] {
    let filtered = items;

    // Apply type filter
    if (filter === 'prescription' || filter === 'labReport') {
        filtered = filtered.filter((item) => item.type === filter);
    } else if (filter === 'active' || filter === 'completed') {
        filtered = filtered.filter((item) => item.status === filter);
    }

    // Apply search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((item) => {
            const matchesTitle = item.title.toLowerCase().includes(query);
            const matchesDoctor = item.doctorName?.toLowerCase().includes(query) ?? false;
            const matchesClinic = item.clinicName?.toLowerCase().includes(query) ?? false;
            const matchesMedicines = item.medicines?.some((m) =>
                m.name.toLowerCase().includes(query)
            ) ?? false;
            const matchesTests = item.labTests?.some((t) =>
                t.name.toLowerCase().includes(query)
            ) ?? false;
            
            return matchesTitle || matchesDoctor || matchesClinic || matchesMedicines || matchesTests;
        });
    }

    return filtered;
}

// Mock data generator for development
export function generateMockHistory(): HistoryItem[] {
    const now = new Date();
    return [
        {
            id: '1',
            type: 'prescription',
            title: 'General Checkup Prescription',
            date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            doctorName: 'Dr. Sarah Johnson',
            clinicName: 'City Medical Center',
            medicines: [
                {
                    name: 'Amoxicillin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    duration: '7 days',
                },
                {
                    name: 'Ibuprofen',
                    dosage: '400mg',
                    frequency: 'Every 6 hours',
                    duration: '5 days',
                },
            ],
            status: 'active',
            notes: 'Take with food. Complete the full course.',
        },
        {
            id: '2',
            type: 'labReport',
            title: 'Complete Blood Count',
            date: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
            doctorName: 'Dr. Michael Chen',
            clinicName: 'Health Diagnostics Lab',
            labTests: [
                {
                    name: 'Hemoglobin',
                    value: '14.2',
                    unit: 'g/dL',
                    status: 'normal',
                    referenceRange: '13.5-17.5 g/dL',
                },
                {
                    name: 'White Blood Cells',
                    value: '7.5',
                    unit: '×10³/μL',
                    status: 'normal',
                    referenceRange: '4.5-11.0 ×10³/μL',
                },
                {
                    name: 'Platelets',
                    value: '250',
                    unit: '×10³/μL',
                    status: 'normal',
                    referenceRange: '150-450 ×10³/μL',
                },
            ],
            status: 'completed',
        },
        {
            id: '3',
            type: 'prescription',
            title: 'Diabetes Management',
            date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            doctorName: 'Dr. Emily Rodriguez',
            clinicName: 'Endocrine Care Clinic',
            medicines: [
                {
                    name: 'Metformin',
                    dosage: '1000mg',
                    frequency: 'Twice daily',
                    duration: '30 days',
                },
            ],
            status: 'active',
        },
        {
            id: '4',
            type: 'labReport',
            title: 'Lipid Profile',
            date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            doctorName: 'Dr. James Wilson',
            clinicName: 'Cardiac Health Lab',
            labTests: [
                {
                    name: 'Total Cholesterol',
                    value: '185',
                    unit: 'mg/dL',
                    status: 'normal',
                    referenceRange: '<200 mg/dL',
                },
                {
                    name: 'LDL Cholesterol',
                    value: '120',
                    unit: 'mg/dL',
                    status: 'normal',
                    referenceRange: '<100 mg/dL',
                },
                {
                    name: 'HDL Cholesterol',
                    value: '45',
                    unit: 'mg/dL',
                    status: 'abnormal',
                    referenceRange: '>60 mg/dL',
                },
                {
                    name: 'Triglycerides',
                    value: '150',
                    unit: 'mg/dL',
                    status: 'normal',
                    referenceRange: '<150 mg/dL',
                },
            ],
            status: 'completed',
        },
        {
            id: '5',
            type: 'prescription',
            title: 'Antibiotic Course',
            date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            doctorName: 'Dr. Robert Kim',
            clinicName: 'Family Care Clinic',
            medicines: [
                {
                    name: 'Azithromycin',
                    dosage: '500mg',
                    frequency: 'Once daily',
                    duration: '5 days',
                },
            ],
            status: 'completed',
        },
    ];
}
