import axios from 'axios';
import { API_URL } from '../utils/Consts';

export const validateToken = async (token) => {
    try {
        const { data } = await axios.post(`${API_URL}/token`, { token });
        return data;

    } catch (e) {
        return false;
    }
}
export const createGlasses = async (glassesData) => {
    try {
        const { data } = await axios.post(`${API_URL}/glasses`, { glassesData });
        return data;

    } catch (e) {
        return { stateAction: false };
    }
}
export const getAllGlasses = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/glasses`);
        return data;

    } catch (e) {
        return { stateAction: false };
    }
}
export const deleteGlasses = async id => {
    try {
        const { data } = await axios.delete(`${API_URL}/glasses/${id}`);
        return data;
    } catch (e) {
        return { stateAction: false }
    }
}
export const getMount = async id => {
    try {
        const { data } = await axios.get(`${API_URL}/glasses/${id}`);
        return data;
    } catch (e) {
        return { stateAction: false }
    }
}
