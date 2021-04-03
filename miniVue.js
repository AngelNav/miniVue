class MiniVueRective {
    constructor(options) {
        //origin from proxy
        this.origin = options.data()
    }

    mount() {
        document.querySelectorAll("*[m-text]").forEach(el => {
            this.mText(el, this.origin, el.getAttribute("m-text"))
        })
    }

    mText(el, target, name) {
        el.innerText = target[name]
    }

    mModel() { }

}

var MiniVue = {
    createApp(options) {
        return new MiniVueRective(options)
    }
}
