const escapeHTML = str => str.replace(/[&<>'"]/g,
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));

chrome.storage.sync.get("stylesheet", data => {
    if (data.hasOwnProperty("stylesheet")) {
        let styles = data.stylesheet;
        if (styles) {
            addStyle(styles);
        }
    }
});

let dv = document.createElement("div");
document.body.appendChild(dv);

dv.id = "kaas";
dv.onmouseenter = () => refresh();
dv.innerHTML = `<strong>Table of contents</strong>
<div class="inner">
    <ol></ol>
</div>
<a>refresh</a>`;

let ol = dv.getElementsByTagName("ol")[0];
console.log(ol);
let a = dv.children[dv.children.length - 1];
a.onclick = () => refresh();


addStyle(`

#kaas {
    padding: 4px;
	background: #fff;
	position: absolute;
	top: 12px;
	right: 100px;
    max-width: 250px;
    text-align:right;
}

#kaas .inner {
    max-height: 50vh;
    overflow-x: auto;
    overflow-y: none;
    display:block;
    text-align:left;
}

#kaas .inner::-webkit-scrollbar {
    width: 4px;
}

#kaas .inner::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 2px;
}

#kaas:hover {
	border: solid 1px #eee;
	padding: 3px
}

#kaas .inner,
#kaas > a {
	display: none
}

#kaas:hover .inner,
#kaas:hover > a {
	display: block
}

`);

function refresh() {

    let fol = document.createElement("ol");

    [...document.querySelectorAll('.heading-command-wrapper h1, .heading-command-wrapper h2, .heading-command-wrapper h3, .heading-command-wrapper h4, .notebook-command-title input')].map(ex1 => {
        var li = document.createElement('li');
        var ea = document.createElement('a');
        li.appendChild(ea);
        ea.innerText = ex1.nodeName == "INPUT" ? ex1.value : ex1.innerText;
        ea.onclick = function () {
            ex1.closest('.heading-command-wrapper').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        };

        return li
    }).forEach(li => fol.appendChild(li));

    // only update when changed :-)
    if (ol.innerHTML !== fol.innerHTML) {
        ol.innerHTML = fol.innerHTML;
    }
}

function addStyle(styles) {
    var st = document.createElement("style");
    st.innerText = styles;
    document.head.appendChild(st);
}

function locationHashChanged() {
    dv.style.display = location.hash.indexOf("#notebook") == -1 ? 'none' : 'block';

    if (dv.style.display == 'block') {
        refresh();
        for (var i = 1; i < 20; i++) {
            setTimeout(refresh, 500 * i);
        }
    }

}

locationHashChanged();
window.addEventListener('DOMContentLoaded', locationHashChanged, false);
window.addEventListener('hashchange', locationHashChanged, false);

