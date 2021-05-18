import { FC } from 'react';

interface ErrorProps {
    icon?: string,
    message: string,
    className?: string,
    iconClassName?: string
}

const Error: FC<ErrorProps> = ({ children, icon = "", message, className = "", iconClassName = "" }) => {
    return (
        <div className={`glitch-wrapper row ${className}`} >
            { icon !== "" && <span className={`material-icons ${iconClassName}`}>{icon}</span>}
            <div className="glitch" data-text={message}>{message}</div>
            {children}
        </div >
    )
}

export default Error;
