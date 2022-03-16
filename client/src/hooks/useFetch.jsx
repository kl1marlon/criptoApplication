import { useEffect, useState } from "react";

const API_KEY= import.meta.env.VITE_GIPHY_API;

const useFetch= ({keyword}) =>{
    const [gifURL, setGifURL] = useState('');

    const fetchGifs = async  () =>{
        try {  
            console.log({keyword, API_KEY})                                                                                 //separamos la palabra y la unimos para buscarla de esa manera
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(' ').join('')}&limit=1`);

            const {data} = await response.json();
            console.log(data)

            setGifURL(data[0]?.images?.downsized_medium?.url)

        } catch (error) {
            setGifURL('https://acegif.com/wp-content/uploads/gif-shaking-head-38.gif');
            console.log(error)
        }
    }

    useEffect(() => {
      //si keyword no esta vacio disparamos la funcion 
        if(keyword) fetchGifs()

        //cada vez que se modifique keyword se dispara la funcion
    }, [keyword]);
    
    return gifURL;
}

export default useFetch;

