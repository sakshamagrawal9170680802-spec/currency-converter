import { useState,useEffect } from "react"

function useCurrencyinfo(currency){
    let [data,setData]=useState({})
    useEffect(function(){fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
    .then((res)=>res.json())
    .then((res)=>setData(res[currency]))},[currency])
    return data
}

export default useCurrencyinfo;

//this is my custom Hook it is nnothing different from a regular function