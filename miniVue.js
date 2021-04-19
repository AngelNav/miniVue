class MiniVueRective {

    //dependencies (followed by trackers)
    deps = new Map()

    constructor(options) {
        //origin from proxy
        this.origin = options.data()

        const self = this;

        //DESTINY

        //$data is the same as origin but with
        //methods from proxy (trampas)
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if (Reflect.has(target, name)) {
                    self.track(target, name)
                    return Reflect.get(target, name)
                }

                console.warn(`Property ${name} doesn't exists`)
                return ""
            },
            set(target, name, value) {
                Reflect.set(target, name, value)
                self.trigger(name)
            }
        })
    }

    //effect - track - trigger

    track(target, name) {
        if (!this.deps.has(name)) {
            const effect = () => {
                document.querySelectorAll(`*[m-text=${name}]`).forEach(el => {
                    this.mText(el, target, name);
                });

                document.querySelectorAll(`*[m-model=${name}]`).forEach(el => {
                    this.mModel(el, target, name)
                })

                document.querySelectorAll(`*[m-bind]`).forEach(el => {
                    const [attr, name] = el.getAttribute("m-bind").match(/(\w+)/g)
                    this.mBind(el, this.$data, name, attr)
                })
            };
            this.deps.set(name, effect);
        }
    }

    trigger(name) {
        const effect = this.deps.get(name)
        effect()
    }

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

        document.querySelectorAll("*[m-bind]").forEach(el => {
            const [attr, name] = el.getAttribute("m-bind").match(/(\w+)/g)
            this.mBind(el, this.$data, name, attr)
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

    mBind(el, target, name, attr) {
        Reflect.set(el, attr, Reflect.get(target, name))
    }

}

var MiniVue = {
    createApp(options) {
        return new MiniVueRective(options)
    }
}
