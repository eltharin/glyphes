import * as system  from "../_helpers.mjs";

export class MessageActionResolver {
    static actions = {
    }

    static register(key, fct) {
        MessageActionResolver.actions[key] = fct;
    }

    static executeAction(action, event, message, data) {
        
        let act = this.actions[action];
        if(act != null) {
            act(event, message, data)
        } else {
            
        }
    }
}