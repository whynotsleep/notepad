export default class Request {
    constructor() {
      
    }

    async query(fnname, params = {}) {
        const fn = this[fnname]
        
        if(typeof fn === 'function') {            
          return this[fnname](params)
        }
        return {code: 404, data: null, msg: ''}
    }
}