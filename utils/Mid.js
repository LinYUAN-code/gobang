

class Mid {
    constructor() {
        this.dep = {};
    }
    init(key,cb) {
        this.dep[key] = cb;
    }
    send(key,x,y) {
        for(let k in this.dep) {
            if(k === key)continue;
            this.dep[k](x,y);
        }
    }
    remove(key) {
        delete this.dep[key];
    }
}

export default new Mid();