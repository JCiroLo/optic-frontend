import React, { FC } from 'react';
import '../../css/Input.scss';

interface InputProps {
    className?: string,
    formType: 'input' | 'textarea' | 'select',
    inputType?: string,
    inputClassName?: string,
    id: string,
    autoFocus?: boolean,
    value: string | number,
    onChange: React.ChangeEventHandler,
    labelClassName?: string,
    labelText: string
};

const Input: FC<InputProps> = ({
    children,                   /* Form */
    className = "",
    formType,
    inputType,                  /* Input */
    inputClassName = "",
    id,
    autoFocus,
    value,
    onChange,
    labelClassName = "",        /* Label placeholder */
    labelText,
}) => {
    return (
        <div className={`custom-form ${className}`}>
            {formType === 'input' ?
                <input
                    className={inputClassName}
                    id={id}
                    type={inputType}
                    spellCheck="false"
                    autoFocus={autoFocus}
                    value={value}
                    onChange={onChange}
                /> :
                formType === 'textarea' ?
                    <textarea
                        className={inputClassName}
                        id={id}
                        spellCheck="false"
                        autoFocus={autoFocus}
                        value={value}
                        onChange={onChange}
                        rows={8}
                    /> :
                    formType === 'select' ?
                        <select
                            className={inputClassName}
                            id={id}
                            autoFocus={autoFocus}
                            value={value}
                            onChange={onChange}
                        >
                            {children}
                        </select>
                        : null
            }
            <label
                className={labelClassName}
                htmlFor={id}>
                {labelText}
            </label>
            <span className="decoration-line" />
        </div>
    )
}

export default Input;