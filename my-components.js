// TimeFormatted
class TimeFormatted extends HTMLElement {
  render() {
    // 提取 渲染逻辑 为单独的逻辑
    let myDate = new Date(this.getAttribute('datetime') || Date.now())

    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    this.innerHTML = `${year} 年 ${month} 月 ${day} 日`
  }

  connectedCallback() {
    // 在元素被插入到页面的时候调用
    if (!this.rendered) {
      this.render()
      this.rendered = true
    }
  }

  static get observedAttributes() {
    return ['datetime']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // 在 observedAttributes() 里的属性改变的时候被调用
    this.render()
  }
}

customElements.define('time-formatted', TimeFormatted)
