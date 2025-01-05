import React,{useState} from 'react';

export const convertTo64 = (file) => { // converter for file to base 64 string
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = error => reject(error);
    });
}