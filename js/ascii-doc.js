import { asciidoctor, asciidoctorExtensions } from './load-asciidoctor.js';


const { deIndent } = await import('./helpers.js');

export class AsciiDocElement extends HTMLElement {
  constructor() {
    super();
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  get content() {
    return this._content;
  }

  set content(html) {
    this._content = html;
    this._contentFromHTML = false;

    this.render();
  }

  static get observedAttributes() {
    return ["src"];
  }

  connectedCallback() {
    if (this._content === undefined) {
      this._contentFromHTML = true;
      this.content = deIndent(this.innerHTML);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case "src":
        let url;
        try {
          url = new URL(newValue, location);
        } catch (e) {
          return;
        }

        let prevSrc = this.src;
        this._src = url;

        if (this.src !== prevSrc) {
          fetch(this.src)
            // fetch(new URL(location))
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${this.src}: ${response.status} ${response.statusText}`);
              }
              return response.text();
            })
            .then(text => {
              this.content = text;
            })
            .catch(e => { });
        }

        break;
    }
  }

  render() {
    const html = asciidoctor.convert(this.content, { 'extension_registry': asciidoctorExtensions });
    this.innerHTML = html;
  }
}

customElements.define("ascii-doc", AsciiDocElement);
