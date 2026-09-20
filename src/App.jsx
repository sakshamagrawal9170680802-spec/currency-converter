import bgimage from './assets/bg.png'
import CurrencyDefiner from './components/Currency'
import { useState,useEffect } from 'react'
import useCurrencyinfo from './components/Currencyinfo'
import useCurrencylist from './components/CurrencyList'
function App() {
  let [from,setFrom]=useState(0)
  let [to,setTo]=useState(0)
  let [fromCurrency,setFromCurrency]=useState("usd")
  let [toCurrency,setToCurrency]=useState("inr")
  const data=useCurrencyinfo(fromCurrency)
  const currencyList=useCurrencylist()
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className='flex flex-col gap-2 justify-center items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-3'>
        <CurrencyDefiner setvaluefunction={setFrom} value={from} currencytype={fromCurrency} setcurrencyfunction={setFromCurrency} currencyList={currencyList}/>
        <button type='button' className='bg-blue-600 text-white rounded-sm p-1 text-sm border-white border-2 cursor-pointer active:bg-blue-700 active:border-gray-300' onClick={function(){
          const temp=toCurrency;
          setToCurrency(fromCurrency)
          setFromCurrency(temp)
        }}>Swap</button>
        <CurrencyDefiner type='To' setvaluefunction={setTo} value={to} currencytype={toCurrency} setcurrencyfunction={setToCurrency} currencyList={currencyList}/>
        <button type="button" className='bg-blue-600 text-white rounded-md p-2 w-75 border border-black hover:bg-blue-700 active:shadow-lg active:bg-blue-800' onClick={function(){
          const changeRate=data[toCurrency]
          const convertedValue=(from*changeRate)
          setTo(convertedValue)
        }}>Convert {fromCurrency.toUpperCase()} to {toCurrency.toUpperCase()}</button>
      </div>
    </div>
  )
}

export default App

//note changes made in to or from or toCurrency makes that function in which it is defined to re run therefore every thing even that useCurrencyinfo will also re run but useEffect inside useCurrencyinfo will not re run as it is dependent on fromCurrency and fromCurrency is not changed
// Yes — **exactly**, with one important condition: `useEffect` will run again **only if the dependency value it received has changed**.

// Let's trace your exact code.

// ### 1. Initial render

// You have:

// ```jsx
// let [fromCurrency, setFromCurrency] = useState("usd")
// ```

// Then:

// ```jsx
// const data = useCurrencyinfo(fromCurrency)
// ```

// So initially:

// ```text
// App()
//  │
//  ├── fromCurrency = "usd"
//  │
//  └── useCurrencyinfo("usd")
//           │
//           └── useEffect(..., ["usd"])
//                     ↓
//                 runs ✓
//                     ↓
//                 fetch USD data
// ```

// ---

// ### 2. You change `fromCurrency`

// Suppose you select INR:

// ```jsx
// setFromCurrency("inr")
// ```

// React schedules a re-render of `App`.

// Now `App()` runs again.

// This line:

// ```jsx
// const data = useCurrencyinfo(fromCurrency)
// ```

// is executed again.

// But this time:

// ```text
// fromCurrency = "inr"
// ```

// So conceptually:

// ```text
// First render:
// useCurrencyinfo("usd")

// Second render:
// useCurrencyinfo("inr")
// ```

// Inside your custom hook:

// ```jsx
// function useCurrencyinfo(currency) {
//     let [data, setData] = useState({})

//     useEffect(() => {
//         fetch(...)
//     }, [currency])

//     return data
// }
// ```

// React compares the dependency:

// ```text
// Previous render: "usd"
// Current render:  "inr"

// "usd" !== "inr"
// ```

// Therefore:

// ```text
// useEffect runs again ✓
// ```

// and your API request becomes:

// ```text
// .../currencies/inr.json
// ```

// ---

// ## 3. What if `to` changes?

// Suppose:

// ```jsx
// setTo(500)
// ```

// This also causes `App()` to re-render:

// ```text
// App re-renders
//      ↓
// useCurrencyinfo(fromCurrency)
// ```

// But `fromCurrency` hasn't changed.

// For example:

// ```text
// Previous: fromCurrency = "usd"
// Current:  fromCurrency = "usd"
// ```

// Therefore:

// ```jsx
// useEffect(..., [currency])
// ```

// **does NOT run again.**

// So:

// ```text
// setTo()
//    ↓
// App re-renders
//    ↓
// useCurrencyinfo("usd") runs
//    ↓
// useEffect sees "usd" → "usd"
//    ↓
// Effect does NOT run
// ```

// This distinction is very important.

// ---

// ## 4. Your three states

// You have:

// ```jsx
// from
// to
// fromCurrency
// toCurrency
// ```

// But your custom hook only depends on:

// ```jsx
// useCurrencyinfo(fromCurrency)
// ```

// Therefore:

// | What changes   | `App()` runs again? | `useCurrencyinfo()` runs again? | Its `useEffect` runs again? |
// | -------------- | ------------------: | ------------------------------: | --------------------------: |
// | `from`         |                   ✅ |                               ✅ |                           ❌ |
// | `to`           |                   ✅ |                               ✅ |                           ❌ |
// | `fromCurrency` |                   ✅ |                               ✅ |                           ✅ |
// | `toCurrency`   |                   ✅ |                               ✅ |                           ❌ |

// The last row is particularly important.

// Even though `toCurrency` causes `App` to re-render, your hook depends on **`fromCurrency`**, not `toCurrency`.

// ---

// ## 5. Think of it as two separate things

// This is the key concept:

// ### `useCurrencyinfo(fromCurrency)` runs whenever `App` renders

// because it's simply a function call:

// ```jsx
// const data = useCurrencyinfo(fromCurrency)
// ```

// ### But the `useEffect` inside it has its own condition

// ```jsx
// useEffect(() => {
//     ...
// }, [currency])
// ```

// So:

// ```text
//               App re-renders
//                     ↓
//        useCurrencyinfo() runs
//                     ↓
//         ┌───────────┴───────────┐
//         │                       │
//  currency same              currency changed
//         │                       │
//         ↓                       ↓
//  effect doesn't run        effect runs
// ```

// That's why **a function running again does not automatically mean its `useEffect` runs again**.

// The hook function executes, React checks the effect's dependencies, and then decides whether the effect needs to execute.

// ---

// ### One correction to your wording

// You said:

// > "to or from or toCurrency is changed then they will also make App function to run"

// More precisely:

// > **When you call the setter returned by `useState`, React schedules a re-render of the component, so `App()` runs again.**

// So:

// ```jsx
// setFrom(...)
// setTo(...)
// setFromCurrency(...)
// setToCurrency(...)
// ```

// all cause `App()` to render again.

// But only:

// ```jsx
// setFromCurrency(...)
// ```

// will cause **your current `useCurrencyinfo` effect** to run again, because its dependency is `fromCurrency`.
