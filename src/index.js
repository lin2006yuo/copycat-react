import React from "./react/source"
const ReactDOM = React

const App = () => {
  return (
    <div>
      <header>函数组件</header>
      <div>
        <header>标题</header>
        <section>
          <div>哈哈</div>
          <div>哈哈</div>
        </section>
        <footer>底部</footer>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
