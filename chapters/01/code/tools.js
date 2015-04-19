var services = angular.module('app.services', []);
services.service('tools', tools);

/**
 * the service contains and execution context that is shared
 * throughout  the life of the demoService executed context, which is 
 * the entire lifecycle of the app.
 **/
function tools() {
    
    this.unlock = unlock;
    this.lock = lock;
    
    /**
     * @param {Object} obj An object that is set to unlocked.
     **/
    function unlock(obj) {
        obj.locked = false;
    }
    
    /**
     * @param {Object} obj An object that is set to locked.
     **/
    function lock(obj) {
        obj.locked = true;
    }
    
    
}