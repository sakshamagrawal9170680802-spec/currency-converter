import React from 'react'

function CurrencyDefiner({type='From',setvaluefunction,value,currencytype,setcurrencyfunction,currencyList}){
    return (
        <div className='flex bg-white justify-between rounded-md p-2 gap-3 w-69'>
            <div className='flex flex-col gap-1'>
                <span className='text-gray-500 text-sm'>{type}</span>
                <input type="number" name="number" id="number" defaultValue={0} min={0} className='focus:outline-none text-sm w-25' value={value}     readOnly={type==="To"} onChange={function(e){
                    setvaluefunction(e.target.value)
                }}/>
            </div>
            <div className='flex flex-col gap-1 items-end'>
                <span className='text-gray-500 text-sm'>Currency Type</span>
                <select className='text-sm bg-gray-200 rounded-sm w-16 focus:outline-none' name="currency_type" id="currency" value={currencytype} onChange={function(e){
                    setcurrencyfunction(e.target.value)
                }}>
                    {currencyList.map((currency)=>
                        (<option value={currency} key={currency}>{currency.toUpperCase()}</option>)
                    )}
                </select>
            </div>
        </div>
    )
}

export default CurrencyDefiner