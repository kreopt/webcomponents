!function () {

    var sfAjaxFormProto = Object.create(HTMLFormElement.prototype, {});

    sfAjaxFormProto.submit = function (e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            return
        }

        var fd = new FormData(this);
        var url = this.getAttribute('action') || "";
        var method = this.getAttribute('method') || "POST";
        var _this = this;
        var buttons = this.getElementsByTagName('button');
        for (var i=0; i<buttons.length; i++){
            buttons[i].setAttribute('disabled', 'disabled');
        }

        var dyn_files = this.querySelectorAll('input[data-dyn-type="file"]');
        for (i = 0; i< dyn_files.length; i++) {
            fd.append(dyn_files[i].dataset['name']+"[]", dyn_files[i].file, dyn_files[i].file.name);
        }

        var xhr = new XMLHttpRequest();

        xhr.open( method, url, true );
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4) {
                if (xhr.status==200) {
                    var evt = new CustomEvent("success", {detail: {response: xhr.responseText}});
                } else {
                    evt = new CustomEvent("error", {detail: {error: xhr.responseText}});
                }
                _this.dispatchEvent(evt);
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].removeAttribute('disabled', 'disabled');
                }
            }
        };
        xhr.send( fd );
    };

    sfAjaxFormProto.createdCallback = function () {
        console.log('created');
        //var t = owner.querySelector('#ajax_form_template');
        //var clone = owner.importNode(t.content, true);
        //var shadow = this.createShadowRoot();
        //shadow.appendChild(clone);
        //this.addEventListener('click', function(e){
        //    var el = e.target;
        //    if (el && el.tagName == 'BUTTON' && el.type=="submit") {
        //        var evt = new Event("submit");
        //        this.dispatchEvent(evt);
        //    }
        //
        //}, false);
        this.addEventListener('submit', this.submit, false);
    };

    sfAjaxFormProto.attachedCallback = function () {
        console.log('attached');
    };

    sfAjaxFormProto.detachedCallback = function () {
        console.log('detached');
    };

    sfAjaxFormProto.attributeChangedCallback = function (name, oldVal, newVal) {
        console.log(
            'Attribute ' + name +
            ' changed from ' + oldVal +
            ' to ' + newVal + '\n');
    };


    document.registerElement('sf-ajax-form', {
        prototype: sfAjaxFormProto,
        extends: "form"
    });
}();
