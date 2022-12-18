/**
 * <md-block> custom element
 * @author Lea Verou
 */

const { loadParser, modules } = await import('./load-markdown-it.js');
const DOMPurify = (await import('./lib/purify.es.js')).default;
let Prism = window.Prism;

export const URLs = {
  mdParser: "./load-markdown-it.js.js",
  DOMPurify: "./lib/purify.es.js"
}

const { deIndent } = await import("./helpers.js");

export class MdItElement extends HTMLElement {
  constructor() {
    super();

    this.parsingOptions = Object.assign({}, this.constructor.parsingOptions);

    for (let property in this.parsingOptions) {
      this.parsingOptions[property] = this.parsingOptions[property].bind(this);
    }

    this._parser = loadParser();
  }

  get rendered() {
    return this.getAttribute("rendered");
  }

  get mdContent() {
    return this._mdContent;
  }

  set mdContent(html) {
    this._mdContent = html;
    this._contentFromHTML = false;

    this.render();
  }

  connectedCallback() {
    Object.defineProperty(this, "untrusted", {
      value: this.hasAttribute("untrusted"),
      enumerable: true,
      configurable: false,
      writable: false
    });

    if (this._mdContent === undefined) {
      this._contentFromHTML = true;
      this._mdContent = deIndent(this.innerHTML);
    }

    this.render();

  }

  async render() {
    if (!this.isConnected || this._mdContent === undefined) {
      return;
    }

    let html = this._parse();

    if (this.untrusted) {
      let mdContent = this._mdContent;
      html = await MdItElement.sanitize(html);
      if (this._mdContent !== mdContent) {
        // While we were running this async call, the content changed
        // We don’t want to overwrite with old data. Abort mission!
        return;
      }
    }

    this.innerHTML = html;

    if (!Prism && URLs.Prism && this.querySelector("code")) {
      Prism = import(URLs.Prism);

      if (URLs.PrismCSS) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = URLs.PrismCSS;
        document.head.appendChild(link);
      }
    }

    if (Prism) {
      await Prism; // in case it's still loading
      Prism.highlightAllUnder(this);
    }

    if (this.src) {
      this.setAttribute("rendered", this._contentFromHTML ? "fallback" : "remote");
    }
    else {
      this.setAttribute("rendered", this._contentFromHTML ? "content" : "property");
    }

    // Fire event
    let event = new CustomEvent("md-render", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  static parsingOptions = {
    setAnchor() {
      const hlinks = this.hlinks ?? null;

      if (hlinks !== null) {
        if (hlinks === "") {
          this._parser.use(modules.Anchor, {
            permalink: modules.Anchor.permalink.headerLink()
          })
        } else {
          this._parser.use(modules.Anchor, {
            permalink: modules.Anchor.permalink.linkInsideHeader({
              symbol: hlinks,
              placement: 'before'
            })
          })
        }
      }
    },
    setMinimalHeaderLevel(content) {
      const hmin = (this.hmin  ?? 1) - 1;
      if (hmin == 0) {
        return content;
      }
      const newContent = content.replaceAll(/^(#{1,6})/gm, (_, p1) => '#'.repeat(p1.length > (6 - hmin) ? 6 : p1.length + hmin));
      return newContent;
    }
  };

  static async sanitize(html) {

    await DOMPurify; // in case it's still loading

    return DOMPurify.sanitize(html);
  }
};

export class MdItSpan extends MdItElement {
  constructor() {
    super();
  }

  _parse() {
    return this._parser.renderInline(this._mdContent);
  }
}

export class MdItBlock extends MdItElement {
  constructor() {
    super();
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  get hmin() {
    return this._hmin || 1;
  }

  set hmin(value) {
    this.setAttribute("hmin", value);
  }

  get hlinks() {
    return this._hlinks ?? null;
  }

  set hlinks(value) {
    this.setAttribute("hlinks", value);
  }

  _parse() {
    const tempContent = this.parsingOptions.setMinimalHeaderLevel(this._mdContent)
    this.parsingOptions.setAnchor();
    return this._parser.render(tempContent);
  }

  static get observedAttributes() {
    return ["src", "hmin", "hlinks"];
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
        }
        catch (e) {
          return;
        }

        let prevSrc = this.src;
        this._src = url;

        if (this.src !== prevSrc) {
          fetch(this.src)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${this.src}: ${response.status} ${response.statusText}`);
              }

              return response.text();
            })
            .then(text => {
              this.mdContent = text;
            })
            .catch(e => { });
        }

        break;
      case "hmin":
        if (newValue > 0) {
          this._hmin = newValue;

          this.render();
        }
        break;
      case "hlinks":
        this._hlinks = newValue;
        this.render();
    }
  }
}


customElements.define("mdit-block", MdItBlock);
customElements.define("mdit-span", MdItSpan);
