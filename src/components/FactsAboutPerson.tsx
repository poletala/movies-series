import './facts-about-person.css'

type Props = {
    fact?: string
}
//Функция приведения текста факта в читаемый вид
function cleanText(text: string | undefined): string {
    let textNew = String(text)
    console.log(typeof(textNew), textNew, text)
    // Заменяем тег <a> на его содержимое
    textNew = textNew.replace(/<a[^>]*>(.*?)<\/a>/g, "$1");
    // Заменяем спецсимволы &raquo; на кавычки
    textNew = textNew.replace(/&raquo;/g, '"');
    return textNew;
}

export const FactsAboutPerson = (props: Props) => {
    return (
        <div className="person-fact">
            <p>{cleanText(props.fact)}</p>
        </div>
    )
}