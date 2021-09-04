export class GlassLayer extends HTMLElement {
  constructor() {
    super();
    const style = document.createElement('style');
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(style);
    style.textContent = `
        :host { 
          width: 100%;
          height: 100%;
        }`;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
          .display {
            background-color: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(16px) brightness(60%) contrast(40%) drop-shadow(4px 4px 10px blue) grayscale(30%) hue-rotate(120deg) invert(70%) opacity(20%) sepia(90%) saturate(80%);
            -webkit-backdrop-filter: blur(16px) brightness(60%) contrast(40%) drop-shadow(4px 4px 10px blue) grayscale(30%) hue-rotate(120deg) invert(70%) opacity(20%) sepia(90%) saturate(80%);
            width: 100%;
            height: 100%;
          }
        </style>
        <div class="display"><slot></slot></div>`;
    this.shadowRoot.appendChild(template.content);
  }
}
customElements.define('glass-layer', GlassLayer);
