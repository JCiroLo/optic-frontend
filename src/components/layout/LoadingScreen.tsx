import { FC } from 'react'

const LoadingScreen: FC = () => {
    return (
        <div className="loading">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default LoadingScreen;
