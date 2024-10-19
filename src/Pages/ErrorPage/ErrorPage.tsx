import { Link } from 'react-router-dom'

export const ErrorPage = () => {
    return (
        <div>
            <h1>404</h1>
            <Link to='/'>Go to Home Page</Link>
        </div>
    )
}