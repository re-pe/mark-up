await import ("./lib/asciidoctor/asciidoctor.js");
await import ("./lib/asciidoctor/asciidoctor-emoji.js");
const asciidoctor = Asciidoctor();
const emoji = AsciidoctorEmoji;
const asciidoctorExtensions = asciidoctor.Extensions.create();
emoji.register(asciidoctorExtensions);
export { asciidoctor, asciidoctorExtensions };