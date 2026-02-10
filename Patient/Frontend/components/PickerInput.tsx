import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface PickerInputProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
}

export function PickerInput({ label, value, onValueChange, options, placeholder = 'Select...', iconName }: PickerInputProps) {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
            >
                {iconName && (
                    <Ionicons name={iconName} size={20} color={Colors.light.icon} style={styles.icon} />
                )}
                <Text style={[styles.pickerText, !value && styles.placeholder]}>
                    {value || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.light.icon} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.optionsList}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionItem,
                                        value === option && styles.selectedOption
                                    ]}
                                    onPress={() => {
                                        onValueChange(option);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        value === option && styles.selectedOptionText
                                    ]}>
                                        {option}
                                    </Text>
                                    {value === option && (
                                        <Ionicons name="checkmark" size={20} color={Colors.light.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
        marginLeft: 4,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 35,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    icon: {
        marginRight: 12,
    },
    pickerText: {
        flex: 1,
        fontSize: 15,
        color: '#334155',
    },
    placeholder: {
        color: '#94A3B8',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
    },
    optionsList: {
        padding: 10,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginVertical: 4,
    },
    selectedOption: {
        backgroundColor: '#F0F9FF',
    },
    optionText: {
        fontSize: 16,
        color: '#334155',
    },
    selectedOptionText: {
        color: Colors.light.primary,
        fontWeight: '600',
    },
});
