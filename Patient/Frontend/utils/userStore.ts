import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'medhive_user_data';

export interface UserData {
    med_id: string;
    fname: string;
    lname: string;
    email: string;
    date_of_birth?: string;
    gender?: string;
    phone_number?: string;
    district?: string;
    province?: string;
    member_since?: string;
    blood_group?: string;
    weight_kg?: string | number;
    blood_pressure?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    medical_records?: string;
    diseases?: string;
    allergies?: string;
    other_info?: string;
}

export const saveUser = async (user: UserData) => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
        console.error('Error saving user data', e);
    }
};

export const getUser = async (): Promise<UserData | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(USER_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error getting user data', e);
        return null;
    }
};

export const clearUser = async () => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
        console.error('Error clearing user data', e);
    }
};