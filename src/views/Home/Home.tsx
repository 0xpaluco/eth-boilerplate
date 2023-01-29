import { useState } from "react";

interface HomeProps {

}

const HomeView = ({ }: HomeProps) => {
    const [data, SetData] = useState('');
    return (
        <>
            <h1 id="primary-heading" className="sr-only">
                Photos
            </h1>
        </>
    )
}



export default HomeView