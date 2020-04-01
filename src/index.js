import React from "./react"
const ReactDOM = React

// import ReactDOM from "./react"
// import  React from 'react'

const element = (
  <div>
    <header>标题</header>
    <section>
      <div>哈哈</div>
      <div>哈哈</div>
    </section>
    <footer>底部</footer>
  </div>
)

const App = () => {
  return (
    <div>
      <header>函数组件</header>
    </div>
  )
}

ReactDOM.render(element, document.getElementById("root"))
