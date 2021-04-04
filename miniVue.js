class MiniVueRective {
    constructor(options) {
        //origin from proxy
        this.origin = options.data()

        //destiny

        //$data is the same as origin but with
        //methods from proxy (trampas)
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if (Reflect.has(target, name))
                    return Reflect.get(target, name)

                console.warn(`Property ${name} doesn't exists`)
                return ""
            },
            set(target, name, value) {
                Reflect.set(target, name, value)
            }
        })
    }

    //effect - track - trigger
    mount() {
        document.querySelectorAll("*[m-text]").forEach(el => {
            this.mText(el, this.$data, el.getAttribute("m-text"))
        })

        document.querySelectorAll("*[m-model]").forEach(el => {
            const name = el.getAttribute("m-model")
            this.mModel(el, this.$data, name)

            el.addEventListener("input", () => {
                //this.$data[name] = el.value
                Reflect.set(this.$data, name, el.value)
            })
        })
    }

    mText(el, target, name) {
        // el.innerText = target[name]
        //Reflect.get(object, propertyKey)
        el.innerText = Reflect.get(target, name)
    }

    mModel(el, target, name) {
        el.value = Reflect.get(target, name)
    }

}

var MiniVue = {
    createApp(options) {
        return new MiniVueRective(options)
    }
}
