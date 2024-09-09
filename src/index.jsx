import React from "react"
import ReactDOM from "react-dom"
import "./index.css"

window.location.href = `${window.location.origin}/decrypto/${window.location.hash}`

ReactDOM.render(
  <React.StrictMode>
    <div className="h-screen w-screen text-gray-500">This is the root page.</div>
  </React.StrictMode>,
  document.getElementById("root")
)
