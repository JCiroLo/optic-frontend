import axios from 'axios';
import { API_URL } from '../utils/Consts';
import { FrameType } from '../utils/Consts';

export const formatText = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).split('_').join(' ');
}

export const validateToken = async (token: string) => {
    try {
        const { data } = await axios.post(`${API_URL}/token`, { token });
        return data;

    } catch (e) {
        return false;
    }
}
export const createGlasses = async (frameData: FrameType) => {
    try {
        const { data } = await axios.post(`${API_URL}/glasses`, { frameData });
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
export const deleteGlasses = async (id: string) => {
    try {
        const { data } = await axios.delete(`${API_URL}/glasses/${id}`);
        return data;
    } catch (e) {
        return { stateAction: false }
    }
}
export const getMount = async (id: string) => {
    try {
        const { data } = await axios.get(`${API_URL}/glasses/${id}`);
        console.log(data)
        return data;
    } catch (e) {
        return { stateAction: false }
    }
}
export const updateMount = async (frameData: FrameType) => {
    try {
        const { data } = await axios.put(`${API_URL}/glasses/${frameData._id}`, frameData);
        return data;
    } catch (e) {
        return { stateAction: false }
    }
}