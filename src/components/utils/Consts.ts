import { CSSProperties } from "react";

export interface FrameType {
    _id: string,
    brand: string,
    material: string,
    color: string,
    shape: string,
    price: number,
    discount: number,
    description: string,
    updatedAt: Date,
    createdAt: Date
};

export const API_URL: string =/*  process.env.REACT_APP_API_URL ||  */'https://optic-back.herokuapp.com/api';

export const COLORS: { id: number, color: string, style: CSSProperties }[] = [
    {
        id: 0, color: 'negro',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, #000 0%, #555 100%)'
        }
    },
    {
        id: 1, color: 'blanco',
        style: {
            boxShadow: '0 0 0 1px #bbb',
            background: 'none'
        }
    },
    {
        id: 2, color: 'rojo',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, #cb3234 0%, #f80044 100%)'
        }
    },
    {
        id: 3, color: 'amarillo',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, rgba(255, 188, 0, 1) 0%, rgba(255, 245, 28, 1) 100%)'
        }
    },
    {
        id: 4, color: 'violeta',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, rgba(120, 20, 206, 1) 0%, 	#DA70D6 100%)'
        }
    },
    {
        id: 5, color: 'verde',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, rgba(0, 87, 7, 1) 0%, rgba(82, 255, 28, 1) 100%)'
        }
    },
    {
        id: 6, color: 'naranja',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, #f44611 0%, #ffa420 100%)'
        }
    },
    {
        id: 7, color: 'azul',
        style: {
            boxShadow: 'none',
            background: 'linear-gradient(45deg, #2271b3 0%, #66FFFF 100%)'
        }
    }
]

export const MATERIALS: { id: number, material: string }[] = [
    { id: 0, material: 'acetato' },
    { id: 1, material: 'aluminio' },
    { id: 2, material: 'metal' },
    { id: 3, material: 'tr90' },
    { id: 4, material: 'plastico' }
]

export const SHAPES: { id: number, shape: string }[] = [
    { id: 0, shape: 'agatada' },
    { id: 1, shape: 'semi_agatada' },
    { id: 2, shape: 'aviador' },
    { id: 3, shape: 'rectangular' },
    { id: 4, shape: 'vintage' },
    { id: 5, shape: 'wayfarer' },
    { id: 6, shape: 'semi_redondas' },
]