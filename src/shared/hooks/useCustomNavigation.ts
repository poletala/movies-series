import { useNavigate } from 'react-router-dom'

export const useCustomNavigation = () => {

    const navigate = useNavigate()
    const to = (path:string) => {
        return navigate(path)
    }
    const goBack = () => {
        return navigate(-1)
    }
    const replace = (path:string) => {
        return navigate(path, { replace: true })
    }
    return { to, goBack, replace}
}
