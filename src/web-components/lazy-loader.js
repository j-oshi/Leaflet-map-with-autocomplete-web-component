import { onceOnly } from '../js/functions';

export class LazyImage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // this.render();
    let root = this;
    window.addEventListener("load", () => {
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

export class LazyPicture extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    let root = this;
    window.addEventListener("load", () => {
      root.observer();
    }, false);
  }

  render() {
    let pic = null, root = this;
    pic = this.createPicture();
    root.createSources()?.forEach(sr => {
      pic.appendChild(sr);
    });  
    pic.appendChild(root.createImage());
    this.shadowRoot.appendChild(pic);
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
            this.render()
            observer.unobserve(entry[0].target);
          }
        };
      }
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(this);
    }
  }

  createPicture() {
    let picture = null;
    picture = document.createElement('picture');
    return picture;
  }

  createImage() {
    let image = null;
    image = document.createElement('img');
    image.setAttribute('src', this.getAttribute('src'));
    image.setAttribute('alt', this.getAttribute('alt'));
    image.setAttribute('style', 'width:auto;');
    return image;
  }

  createSources() {
    let srcset = null, srcEle = null;
    srcset = this.getAttribute('srcset')?.split(';')?.filter(s => s !== "");
    if (srcset.length > 0) {
      srcEle = srcset.map(el => {
        let elAttr = null, srcEl = null;
        elAttr = el.split('=>');
        srcEl = document.createElement('source');
        srcEl.setAttribute('media', `(min-width: ${elAttr[0]}px)`);
        srcEl.setAttribute('srcset', elAttr[1]);
        return srcEl;
      });
      return srcEle;
    }
  }
}
customElements.define('lazy-picture', LazyPicture);

export class LazyIframe extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    let root = this;
    window.addEventListener("load", () => {
      root.observer();
    }, false);
  }

  render() {
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

export class ShowMore extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    let root = this;
    root.render();
    root.observer();
    window.addEventListener("scroll", () => {
      root.observer();
    }, false);
  }

  observer() {
    if ('IntersectionObserver' in window) {
      let observer = null, options = null, root = this;

      options = {
        rootMargin: '0px',
      }

      let handleIntersection = entry => {
        if (entry[0].isIntersecting) {
          if (entry[0].intersectionRatio >= 1) {
            let doc = null;
            doc = new DOMParser().parseFromString(root.renderResult(), 'text/html');
            root.insertAdjacentHTML('beforebegin', doc.body.innerHTML);
            observer.unobserve(entry[0].target);
          }
        };
      }
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(this);
    }
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `<h3><slot></slot></h3>`;
    this.shadowRoot.appendChild(template.content);    
  }

  renderResult() {
    return `
      <div style="width:100%;height:50px">1</div>
      <div style="width:100%;height:50px">2</div>
      <div style="width:100%;height:50px">3</div>
      <div style="width:100%;height:50px">4</div>`;
  }
}
customElements.define('show-more', ShowMore);


export class LazyTag extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    let root = this;
    window.addEventListener("load", () => {
      root.observer();
    }, false);
  }

  observer() {
    if ('IntersectionObserver' in window) {
      let observer = null, options = null;

      options = {
        rootMargin: '0px',
      }

      let handleIntersection = entry => {
        if (entry[0].isIntersecting) {
          if (entry[0].intersectionRatio >= 0.25 && onceOnly()) {
            this.shadowRoot.appendChild(this.render());
            observer.unobserve(entry[0].target);
          }
        };
      }
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(this);
    }
  }

  render() {
    let type = null, att = null, tagArray = null;
    type = this.getAttribute('type')?.toLowerCase();
    tagArray = ["img", "iframe"];
    if (!tagArray.includes(type)) return;

    att = this.getAttribute('attribute');
    return this.createTag(type, att);
  }

  createTag(tag, attributes) {
    let tagEl = null, attributeList = null;
    tagEl = document.createElement(tag);
    attributeList = attributes?.split(';')?.filter(s => s !== "");
    if (attributeList.length > 0) {
      attributeList.forEach(att => {
        let elAttr = null;
        elAttr = att.split('=>');
        tagEl.setAttribute(elAttr[0], elAttr[1]);
      });
    }
    return tagEl;
  }  
}
customElements.define('lazy-tag', LazyTag);

export class EvanesceTag extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    let root = this;
    window.addEventListener("load", () => {
      root.observer();
    }, false);
  }

  observer() {
    if ('IntersectionObserver' in window) {
      let observer = null, options = null;

      options = {
        rootMargin: '0px',
      }

      let handleIntersection = entry => {
        if (entry[0].isIntersecting) {
          if (entry[0].intersectionRatio >= 0.25 && onceOnly()) {
            this.parentNode.insertBefore(this.render(), this);
            observer.unobserve(entry[0].target);
            this.parentNode.removeChild(this);
          }
        };
      }
      observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(this);
    }
  }

  render() {
    let type = null, att = null, tagArray = null;
    type = this.getAttribute('type')?.toLowerCase();
    tagArray = ["img", "iframe"];
    if (!tagArray.includes(type)) return;

    att = this.getAttribute('attribute');
    return this.createTag(type, att);
  }

  createTag(tag, attributes) {
    let tagEl = null, attributeList = null;
    tagEl = document.createElement(tag);
    attributeList = attributes?.split(';')?.filter(s => s !== "");
    if (attributeList.length > 0) {
      attributeList.forEach(att => {
        let elAttr = null;
        elAttr = att.split('=>');
        tagEl.setAttribute(elAttr[0], elAttr[1]);
      });
    }
    return tagEl;
  }  
}
customElements.define('evanesce-tag', EvanesceTag);
