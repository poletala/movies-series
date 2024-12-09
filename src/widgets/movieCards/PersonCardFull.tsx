import { kp } from "../../pages";



export const PersonCardFull = () => {
    const getPersonById = async () => {

    const { data, error, message } = await kp.person.getById(2025);

    if (data) {
        console.log(data);
    }

    if (error) console.log(error, message);
    };

    return (
        <div>
            <button onClick={getPersonById}>Get Person by ID</button>
            
        </div>
    );
}