import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { userActions } from '../../entity/user/slice'

import './index.css'

type Props = {
    onNext: () => void
    saveData: (data: BaseData) => void
}
export type BaseData = z.infer<typeof SignupFormSchema>
//Валидация полей формы
const SignupFormSchema = z.object({
    name: z.string().min(3).max(15),
    email: z.string().email(),
    password: z.string().min(8)
})

export const SignupForm = ({onNext, saveData}: Props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(SignupFormSchema)
    })

    const onSubmit = (data: FieldValues) => {
        // console.log(data)
        saveData(data as BaseData)
        dispatch(userActions.setUser({
            id: 1, 
            name: data.name,
            email: data.email, 
            password:  data.password
        }))
        onNext()
        navigate('/')
    }

    return (
        <div className="login-container">
            <h3>Авторизация</h3>
            <form  
                onSubmit={handleSubmit(onSubmit)} 
                className="login-form"
            >
                <div className="field-login">
                    <label htmlFor="name">Имя</label>
                    <input id="name" {...register("name")}/>
                    {formState.errors.name?.message && (
                        <div className="input-error">
                            {formState.errors.name?.message ? 'Не менее 3 и не более 15 символов' : 'Ошибка'}
                        </div>
                    )}
                </div>
                <div className="field-login">
                    <label htmlFor="email">Email</label>
                    <input  id="email" {...register("email")}/>
                    {formState.errors.email?.message && (
                        <div className="input-error">
                            {formState.errors.email?.message ? 'Неверный формат' : 'Ошибка'}
                        </div>
                    )}
                </div>
                <div className="field-login">
                    <label htmlFor="password">Пароль</label>
                    <input type="password" id="password" {...register("password")}/>
                    {formState.errors.password?.message && (
                        <div className="input-error">
                            {formState.errors.password?.message ? 'Не менее 8 символов' : 'Ошибка'}
                        </div>
                    )}
                </div>
                <button className="form-btn" type="submit">Войти</button>
            </form>
        </div>
    )
}