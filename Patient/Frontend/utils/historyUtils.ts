import { HistoryItem, YearGroup } from '../types/history';
import { FilterType } from '../components/FilterChips';

export function groupHistoryByDate(items: HistoryItem[]): YearGroup[] {
    if (items.length === 0) return [];

    const groupedByYear: { [year: number]: { [month: number]: HistoryItem[] } } = {};

    // First pass: Group by Year and Month
    items.forEach((item) => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth();

        if (!groupedByYear[year]) {
            groupedByYear[year] = {};
        }
        if (!groupedByYear[year][month]) {
            groupedByYear[year][month] = [];
        }
        groupedByYear[year][month].push(item);
    });

    // Second pass: Convert to array structure and sort
    const sortedYears = Object.keys(groupedByYear)
        .map(Number)
        .sort((a, b) => b - a); // Descending years (2026, 2025...)

    const result: YearGroup[] = sortedYears.map((year) => {
        const monthsInYear = groupedByYear[year];
        const sortedMonths = Object.keys(monthsInYear)
            .map(Number)
            .sort((a, b) => b - a); // Descending months (Dec, Nov...)

        const monthGroups = sortedMonths.map((month) => {
            // Sort items within month by date descending
            const sortedItems = monthsInYear[month].sort((a, b) => b.date.getTime() - a.date.getTime());

            const monthLabel = new Date(year, month).toLocaleString('default', { month: 'long' });

            return {
                monthLabel,
                items: sortedItems
            };
        });

        return {
            year,
            months: monthGroups
        };
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
    }

    // Apply search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((item) => {
            const matchesTitle = item.title.toLowerCase().includes(query);
            const matchesClinic = item.clinicName?.toLowerCase().includes(query) ?? false;
            const matchesMedicines = item.medicines?.some((m) =>
                m.name.toLowerCase().includes(query)
            ) ?? false;
            const matchesTests = item.labTests?.some((t) =>
                t.name.toLowerCase().includes(query)
            ) ?? false;

            return matchesTitle || matchesClinic || matchesMedicines || matchesTests;
        });
    }

    return filtered;
}

// Mock data generator for development
export function generateMockHistory(): HistoryItem[] {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    return [
        {
            id: '1',
            type: 'prescription',
            title: 'General Checkup Prescription',
            date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Today
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
            imageUri: 'https://via.placeholder.com/300x400.png?text=Prescription+Image',
        },
        {
            id: '2',
            type: 'labReport',
            title: 'Complete Blood Count',
            date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            clinicName: 'Health Diagnostics Lab',
            labTests: [
                {
                    name: 'Hemoglobin',
                    value: '14.2',
                    unit: 'g/dL',
                    status: 'normal',
                    referenceRange: '13.5-17.5 g/dL',
                },
            ],
            status: 'completed',
        },
        {
            id: '3',
            type: 'prescription',
            title: 'Diabetes Management',
            date: new Date(currentYear, now.getMonth() - 1, 15),
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
            title: 'Annual Physical Results',
            date: new Date(lastYear, 10, 20), // Nov 20th last year
            clinicName: 'Cardiac Health Lab',
            labTests: [
                {
                    name: 'Cholesterol',
                    value: '185',
                    unit: 'mg/dL',
                    status: 'normal',
                },
            ],
            status: 'completed',
        },
        {
            id: '5',
            type: 'prescription',
            title: 'Antibiotic Course',
            date: new Date(lastYear, 10, 25), // Nov 25th last year
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
            imageUri: 'https://via.placeholder.com/300x400.png?text=Prescription+Archive',
        },
    ];
}
