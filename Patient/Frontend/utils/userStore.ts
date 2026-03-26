import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'medhive_user_data';

export interface UserData {
    med_id: string;
    fname: string;
    lname: string;
    email: string;
    date_of_birth?: string | null;
    gender?: string | null;
    phone_number?: string | null;
    district?: string | null;
    province?: string | null;
    member_since?: string | null;
    blood_group?: string | null;
    weight_kg?: string | number | null;
    blood_pressure?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    medical_records?: string | null;
    diseases?: string | null;
    allergies?: string | null;
    other_info?: string | null;
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