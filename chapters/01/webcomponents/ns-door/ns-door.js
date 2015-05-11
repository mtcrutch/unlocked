(function() {
    
   /**
     * ns-door
     * a simple web component, which contains a locked variable
     * and a few methods to alter that variable.
     *
    **/
   
    var doorProto = Object.create(HTMLElement.prototype, {
        createdCallback: {
          value: create
        }
    }),
    importDoc = document.currentScript.ownerDocument
    
    function create() {
    
        var self = this,
            templateUrl = self.getAttribute("template-url"),
            template,
            clone,
            shadow,
            lockBtn,
            unlockBtn;
        
        if (!templateUrl) { templateUrl = '#doorTemplate'; };
        
        template = importDoc.querySelector(templateUrl);
        
        if (!template) { return; }
        
        // public locked value
        doorProto.locked = true;
        
        function unlock() {
            self.locked = false;
            interpolate.call(self);
        }
        
        function lock() {
            self.locked = true;
            interpolate.call(self);
        }
        
        clone = importDoc.importNode(template.content, true);
        shadow = this.createShadowRoot();
        shadow.appendChild(clone);
        lockBtn = shadow.querySelector('.lock-btn');
        unlockBtn = shadow.querySelector('.unlock-btn');
        lockBtn.onclick = lock;
        unlockBtn.onclick = unlock;
        interpolate.call(self);
    }
    
    
    function interpolate() {
        var shadow = this.shadowRoot,
            value = shadow.querySelector('.locked-value');
        
        value.innerHTML = this.locked;
    }

    
    document.registerElement('ns-door', {prototype: doorProto});
    
}());