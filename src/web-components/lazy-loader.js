import { onceOnly } from '../js/functions';

export class LazyImage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    let root = this;
    window.addEventListener("load", (event) => {
      root.observer();
    }, false);
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
            <style>
              .display {
                width: 100%;
                height: 100%;
              }
            </style>
            <img class="display" src="600px-PlaceholderLC.png" style="display:none;" data-src="${this.img}">`;
    this.shadowRoot.appendChild(template.content);
  }

  observer() {
    if ('IntersectionObserver' in window) {
      let observer = null, options = null;

      options = {
        rootMargin: '0px',
      }

      let handleIntersection = entry => {
        if (entry[0].isIntersecting) {
          if (entry[0].intersectionRatio >= 0.25 && entry[0].target.hasAttribute('src') && onceOnly()) {
            let img = this.shadowRoot.querySelector('img');
            if (img && img?.getAttribute('style').includes('display:none')) {
              img.src = entry[0].target.getAttribute('src');
              img.setAttribute('style', 'display:block');
              observer.unobserve(entry[0].target);
            }
          }
        };
      }
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(this);
    }
  }
}
customElements.define('lazy-image', LazyImage);

export class LazyIframe extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    let root = this;
    window.addEventListener("load", (event) => {
      root.observer();
    }, false);
  }

  render() {
    // const template = document.createElement("template");
    // template.innerHTML = this.createIframe();
    // `
    //         <style>
    //           .display {
    //             width: 100%;
    //             height: 100%;
    //           }
    //         </style>
    //         <img class="display" src="600px-PlaceholderLC.png" style="display:none;" data-src="${this.img}">`;
    this.shadowRoot.appendChild(this.createIframe());
  }

  observer() {
    if ('IntersectionObserver' in window) {
      let observer = null, options = null, root = this;

      options = {
        rootMargin: '0px',
      }

      let handleIntersection = entry => {
        if (entry[0].isIntersecting) {
          if (entry[0].intersectionRatio >= 0.25 && entry[0].target.hasAttribute('src') && onceOnly()) {
            root.render();
            observer.unobserve(entry[0].target);
          }
        };
      }
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(this);
    }
  }

  createIframe() {
    let iframe = null, width = null, height = null;
    width = this.getAttribute('width') || '100%';
    height = this.getAttribute('height') || 300;
    iframe = document.createElement('iframe');
    iframe.src = this.getAttribute('src');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height', height);
    iframe.setAttribute('style', 'border:0;');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    return iframe;
  }
}
customElements.define('lazy-iframe', LazyIframe);



// export class LazyImages extends HTMLElement {
//   constructor() {
//     super();
//     const style = document.createElement('style');
//     const shadowRoot = this.attachShadow({ mode: 'open' });
//     shadowRoot.appendChild(style);
//     style.textContent = `
//           :host { 
//             width: 100%;
//             height: 100%;
//           }`;
//   }

//   connectedCallback() {
//     this.render();
//     let mainELement = null;
//     mainELement = this.shadowRoot.querySelector('#scrollArea');
//     this.observer();
//     let root = this;
//     window.addEventListener("load", (event) => {
//       root.observer();
//     }, false);
//   }

//   render() {
//     const template = document.createElement("template");
//     template.innerHTML = `
//             <style>
//               .scrollArea {
//                 width: 100%;
//                 height: 100%;
//               }
//             </style>
//             <div id="scrollArea"><slot></slot></div>`;
//     this.shadowRoot.appendChild(template.content);
//   }

//   observer() {
//     let mainELement = null;
//     mainELement = arguments[0];
//     if ('IntersectionObserver' in window) {
//       let observer = null, options = null, callback = null, slot = null, nodes = null, filteredNodes = null;

//       if (mainELement?.length > 0) {
//         options = {
//           root: mainELement,
//           rootMargin: '0px',
//           threshold: 1.0
//         } 
//       } else {
//         options = {
//           rootMargin: '0px',
//         }     
//       }

//       observer = new IntersectionObserver(
//         (entries, observer) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting) {
//               console.log(entry);

//               if (entry.intersectionRatio >= 0.75) {
//                 if (entry.target.hasAttribute('src')) {
//                   entry.target.src = entry.target.dataset.src;
//                   observer.unobserve(entry.target);
//                   entry.target.removeAttribute('data-src')
//                 }
//               }
//             }
//           });
//         }, options);

//       slot = this.shadowRoot.querySelector('slot');
//       nodes = slot.assignedElements();

//       if (nodes.length > 0) {
//         filteredNodes = nodes.filter(node => node.tagName === "IMG");
//         filteredNodes.forEach(img => { observer.observe(img) });
//       }
//     }
//   }
// }
// customElements.define('lazy-images', LazyImages);