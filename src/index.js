import React from "./react"
const ReactDOM  = React

// import ReactDOM from "./react"
// import  React from 'react'

const element = (
  <div>
    <h1>标题</h1>
    <div>
      <div>哈哈</div>
      <div>哈哈</div>
    </div>
    <a href="www.baidu.com">跳转</a>
  </div>
)

ReactDOM.render(element, document.getElementById("root"))
