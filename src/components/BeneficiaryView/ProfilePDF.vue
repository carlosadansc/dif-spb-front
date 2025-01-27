<template>
  <div id="pdf" ref="document">
    <div id="element-to-convert">
      <div class="bg-white shadow-lg rounded-lg p-8 space-y-6">
            <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
              Documento de Ejemplo
            </h1>

            <div class="space-y-4 text-gray-700">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Sección 1
              </h2>

              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>

              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>

              <h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Sección 2
              </h2>

              <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
              </p>

              <p>
                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
              </p>

              <h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Sección 3
              </h2>

              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              </p>

              <p>
                Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
              </p>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-200">
              <p class="text-sm text-gray-500 text-center">
                Este es un documento de ejemplo generado con vue-html2pdf
              </p>
            </div>
      </div>
    </div>
    <button class="btn" @click="exportToPDF">Export to PDF</button>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";

export default {
  name: "PDF",
  methods: {
    exportToPDF() {
      html2pdf(document.getElementById("element-to-convert"), {
        margin: 1,
        filename: "generated-pdf.pdf",
      });
    },
  },
};
</script>

<style>
#pdf {
  margin-top: 60px;
  text-align: center;
}
</style>