function createElement(type, props, ...children) {
  delete props.__source
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === "object" ? child : createTextElement(child)
      })
    }
  }
}

function createTextElement(text) {
  return {
    type: "text",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createDom(vdom) {
  // container.innerHTML = `<conSolepre>${JSON.stringify(vdom, null, 1)}</pre>`
  const dom =
    vdom.type === "text"
      ? document.createTextNode(vdom.nodeValue)
      : document.createElement(vdom.type)
  updateDOM(dom, {}, vdom.props)
  return dom
}
/**
 *
 * @param {*} dom
 * @param {*} prevProps
 * @param {*} nextProps
 * 1. 规避children属性
 * 2. 老的存在，取消
 * 3. 新的存在，新增 并没有做新老相等判定
 */
function updateDOM(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(name => name !== "children")
    .filter(name => !(name in nextProps))
    .forEach(name => {
      if (name.slice(0, 2) === "on") {
        dom.removeEventListener(
          name.slice(0, 2).toLowerCase(),
          prevProps[name],
          false
        )
      } else {
        dom[name] = ""
      }
    })

  Object.keys(nextProps)
    .filter(name => name !== "children")
    .forEach(name => {
      if (name.slice(0, 2) === "on") {
        dom.addEventListener(
          name.slice(0, 2).toLowerCase(),
          prevProps[name],
          false
        )
      } else {
        dom[name] = nextProps[name]
      }
    })
}

function render(vdom, container) {
  console.log({ vdom })
  wipRoot = {
    dom: container,
    props: {
      children: [vdom]
    },
    base: currentRoot
  }
  deletions = []
  nextUnitOfWork = wipRoot

  // vdom.props.children.forEach(child => {
  //   render(child, dom)
  // })
  // container.appendChild(dom)
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  // domParent.appendChild(fiber.dom)
  if (fiber.effectTag === "REPLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "DELETE") {
    domParent.removeChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    //更新dom
    updateDOM(fiber.dom, fiber.base.props, fiber.props)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
let deletions = null
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

/**
 * fiber = {
 *  dom:
 *  parent:
 *  child:
 *  sibling:
 * }
 */
function performUnitOfWork(fiber) {
  console.log({ fiber })
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function updateFunctionComponent() {}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  let elements = fiber.props.children
  reconcileChildren(fiber, elements)
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber = wipFiber.base && wipFiber.base.child
  let prevSibling = null
  while (index < elements.length || oldFiber != null) {
    let element = elements[index]
    let newFiber = null

    const sameType = oldFiber && element && oldFiber.type === element.type
    if (sameType) {
      // 复用节点
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        base: oldFiber,
        effectTag: "UPDATE"
      }
    }
    if (!sameType && element) {
      // 替换节点
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        base: null,
        effectTag: "REPLACEMENT"
      }
    }
    if (!sameType && oldFiber) {
      // 删除
      newFiber.effectTag = "DELETE"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }
}

export default {
  createElement,
  render
}
