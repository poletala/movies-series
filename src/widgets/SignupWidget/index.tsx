import { useState } from 'react'
import { BaseData, SignupForm } from './SignupForm'
// import { useNavigate } from 'react-router-dom';
type FormStep = 'base' | 'thanks'

export const SignupWidgetForm = () => {
    const [formStep, setFormStep] = useState<FormStep>('base')
    const [baseData, setBaseData] = useState<BaseData>()
    console.log(baseData)
    // const navigate = useNavigate()

    const onNext = () => {
        setFormStep((prevStep) => {
            if(prevStep === 'base') {
                return 'thanks'
            }
            return prevStep
        })
    }

    return (
        <div className='signup'>
            {formStep === 'base' && <SignupForm onNext={onNext} saveData={(data: BaseData) => setBaseData(data)} />}
            {formStep === 'thanks' && <div></div> } 
        </div>
    )
}

