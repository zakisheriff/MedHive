import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { API_ENDPOINTS } from '../constants/config';

interface Clinic {
    clinic_id: number;
    clinic_name: string;
    district: string;
    province: string;
}

interface ClinicSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSelectClinic: (clinic: Clinic) => void;
}

export const ClinicSelector: React.FC<ClinicSelectorProps> = ({
    visible,
    onClose,
    onSelectClinic
}) => {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchClinics();
        }
    }, [visible]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredClinics(clinics);
        } else {
            const filtered = clinics.filter(clinic =>
                clinic.clinic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                clinic.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                clinic.province.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredClinics(filtered);
        }
    }, [searchQuery, clinics]);

    const fetchClinics = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.GET_CLINICS);
            const data = await response.json();

            if (response.ok && data.clinics) {
                setClinics(data.clinics);
                setFilteredClinics(data.clinics);
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectClinic = (clinic: Clinic) => {
        onSelectClinic(clinic);
        setSearchQuery('');
        onClose();
    };

    const renderClinicItem = ({ item }: { item: Clinic }) => (
        <TouchableOpacity
            style={styles.clinicItem}
            onPress={() => handleSelectClinic(item)}
            activeOpacity={0.7}
        >
            <View style={styles.clinicIconContainer}>
                <Ionicons name="medical" size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>{item.clinic_name}</Text>
                <Text style={styles.clinicLocation}>
                    {item.clinic_id}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Clinic</Text>
                    <View style={styles.closeButton} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search clinics..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Clinic List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.light.primary} />
                        <Text style={styles.loadingText}>Loading clinics...</Text>
                    </View>
                ) : filteredClinics.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="medical-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No clinics found' : 'No verified clinics available'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredClinics}
                        renderItem={renderClinicItem}
                        keyExtractor={(item) => item.clinic_id.toString()}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#fff',
    },
    closeButton: {
        width: 60,
    },
    closeButtonText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 35,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    clinicItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 35,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    clinicIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${Colors.light.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    clinicInfo: {
        flex: 1,
    },
    clinicName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    clinicLocation: {
        fontSize: 14,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
