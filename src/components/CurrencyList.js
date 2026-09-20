import { useState,useEffect } from "react"

function useCurrencylist(){
    let [list,setList]=useState([])

    useEffect(function(){fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`)
    .then((res)=>res.json())
    .then((res)=>setList(Object.keys(res)))},[])

    return list
}

export default useCurrencylist;

//this is my custom Hook it is nnothing different from a regular function

//ok now here since useEffect is independent of any argument it will run only once no re rendering will make it run again