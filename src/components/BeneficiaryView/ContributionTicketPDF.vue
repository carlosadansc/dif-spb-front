<template>
  <div id="contribution-ticket">
    <div :id="`ticket-content-${contribution._id}`" class="ticket-content">
      <!-- Encabezado con escudo y logos institucionales -->
      <div class="pdf-header">
        <div class="logo-container">
          <img :src="logoDif" alt="Logo DIF" class="logo" />
          <div class="header-divider"></div>
          <img :src="logoAyunta" alt="Logo Ayuntamieto" class="logo-ayunta" />
        </div>
        <div class="document-title-container">
          <h1 class="document-type">RECIBO</h1>
          <h2 class="document-subtitle">ENTREGA DE APOYO</h2>
        </div>
      </div>
      
      <!-- Información de folio y fecha -->
      <div class="document-info">
        <div class="folio-box">
          <span class="folio-label">FOLIO</span>
          <span class="folio-number">{{ contribution.folio }}</span>
        </div>
        <div class="date-box">
          <span class="date-label">FECHA DE ENTREGA</span>
          <span class="date-value">{{ formatDate(contribution.contributionDate) }}</span>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="content-container">
        <!-- Sección del beneficiario -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN DEL BENEFICIARIO</h3>
          <div class="formal-section-content">
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="info-label">CURP:</td>
                  <td class="info-value">{{ props.beneficiary.curp }}</td>
                  <td class="info-label">TELÉFONO:</td>
                  <td class="info-value">{{ props.beneficiary.phone }}</td>
                </tr>
                <tr>
                  <td class="info-label">NOMBRE COMPLETO:</td>
                  <td class="info-value" colspan="3">{{ props.beneficiary.name }} {{ props.beneficiary.fatherSurname }} {{ props.beneficiary.motherSurname }}</td>
                </tr>
                <tr>
                  <td class="info-label">EDAD:</td>
                  <td class="info-value">{{ props.beneficiary.age }} años</td>
                  <td class="info-label">DOMICILIO:</td>
                  <td class="info-value">{{ props.beneficiary.address.street }} #{{ props.beneficiary.address.extNum }}, {{ props.beneficiary.address.city }}, C.P. {{ props.beneficiary.address.cp }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección de apoyos entregados -->
        <div class="formal-section">
          <h3 class="formal-section-title">DETALLES DEL APOYO</h3>
          <div class="formal-section-content">
            <table class="formal-table">
              <thead>
                <tr>
                  <th class="table-header">CATEGORÍA</th>
                  <th class="table-header">DESCRIPCIÓN</th>
                  <th class="table-header text-center">CANTIDAD</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in contribution.productOrServices" :key="index">
                  <td class="table-cell">{{ item.productOrService.category.name }}</td>
                  <td class="table-cell">{{ item.description }}</td>
                  <td class="table-cell text-center">{{ item.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección de comentarios si existen -->
        <div class="formal-section" v-if="contribution.comments">
          <h3 class="formal-section-title">OBSERVACIONES</h3>
          <div class="formal-section-content">
            <div class="comments-box">
              {{ contribution.comments }}
            </div>
          </div>
        </div>

        <!-- Sección de firmas -->
        <div class="formal-section signature-section">
          <h3 class="formal-section-title">FIRMAS</h3>
          <div class="formal-section-content">
            <div class="signatures-container">
              <div class="signature-column">
                <p class="signature-role">RECIBE</p>
                <div class="signature-line"></div>
                <p class="signature-name">{{ contribution.receiver }}</p>
                <p class="signature-label">BENEFICIARIO / CONYUGUE O TUTOR</p>
              </div>
              <div class="signature-column">
                <p class="signature-role">ENTREGA</p>
                <div class="signature-line"></div>
                <p class="signature-name">{{ contribution.createdBy.name }} {{ contribution.createdBy.lastname }}</p>
                <p class="signature-label">{{ contribution.createdBy.position }}</p>
              </div>
            </div>
            
            <div class="official-signature">
              <p class="signature-role">AUTORIZA</p>
              <div class="signature-line"></div>
              <p class="signature-name">ING. MANUEL SALVADOR MÁRQUEZ VENTURA</p>
              <p class="signature-label">DIRECTOR GENERAL DEL SMDIF LA PAZ B.C.S</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie de página -->
      <div class="footer">
        <div class="official-seal">
          <div class="seal-border">
            <p class="seal-text">SELLO OFICIAL</p>
          </div>
        </div>
        <div class="footer-text">
          <p>Este documento es válido como comprobante oficial de entrega de apoyo social otorgado por el DIF Municipal La Paz B.C.S.</p>
          <p class="document-generated">Documento generado el {{ getCurrentDate() }} a través del Sistema Integral del Padrón de Beneficiarios</p>
          <p class="document-operator">Expedido por: {{ capitalize(user.name) }} {{ capitalize(user.lastname) }} / {{ user.position }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useDate } from '@/utils/dateTool';
import capitalize from '@/utils/capitalize';
import logoDif from '@/assets/img/logo-dif.png';
import logoAyunta from '@/assets/img/logo-ayunta.png';
import { useAuth } from '@/composables/useAuth'

// composables
const { user } = useAuth()
const { formatDate, getCurrentDate } = useDate()

// props
const props = defineProps({
  contribution: {
    type: Object,
    required: true
  },
  beneficiary: {
    type: Object,
    required: true
  }
});

// methods

const generateTicketPDF = async () => {
  const element = document.getElementById(`ticket-content-${props.contribution._id}`);
  if (!element) return;

  await document.fonts.ready;

  // Configurar opciones mejoradas para mejor calidad
  const canvas = await html2canvas(element, {
    scale: 2, // Mayor escala para mejor calidad
    useCORS: true,
    logging: true,
    backgroundColor: '#ffffff',
    windowWidth: 816,
    windowHeight: 1056,
    onclone: (clonedDoc) => {
      const styles = clonedDoc.getElementsByTagName('style');
      for (let style of styles) {
        if (style.innerHTML.includes('@tailwind') || style.innerHTML.includes('oklch')) {
          style.remove();
        }
      }
      // Asegurar fuente consistente
      clonedDoc.body.style.fontFamily = "'Arial', sans-serif";
    }
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10; // Más margen superior

  // Agregar la primera página
  pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Agregar páginas adicionales si es necesario
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Agregar metadatos al PDF
  pdf.setProperties({
    title: `Recibo de Entrega de Apoyo - ${props.beneficiary.name} ${props.beneficiary.fatherSurname}`,
    subject: 'Recibo de Entrega de Apoyo Social DIF Municipal',
    author: 'DIF Municipal La Paz B.C.S.',
    keywords: 'apoyo, recibo, beneficiario, oficial',
    creator: 'Sistema de Padron de Beneficiarios'
  });

  pdf.save(`recibo-entrega-apoyo-${props.beneficiary.name.toLowerCase()}-${props.beneficiary.fatherSurname.toLowerCase()}-${props.contribution.folio}.pdf`);
};

// expose
defineExpose({ generateTicketPDF });
</script>

<style>
#contribution-ticket {
  font-family: 'Arial', sans-serif !important;
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.ticket-content {
  background-color: #ffffff;
  max-width: 816px;
  margin: 0 auto;
  padding: 2rem;
  color: #333333;
}

/* ENCABEZADO FORMAL */
.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo, .logo-ayunta {
  height: 50px;
  width: auto;
}

.header-divider {
  width: 1px;
  height: 40px;
  background-color: #333;
  margin: 0 15px;
}

.document-title-container {
  text-align: right;
  margin-left: auto;
}

.document-type {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #000;
}

.document-subtitle {
  font-size: 16px;
  margin: 5px 0 0 0;
  color: #666;
}

/* INFORMACIÓN DE DOCUMENTO */
.document-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #333;
  border-top: 2px solid #333;
  padding: 10px 0;
}

.folio-box, .date-box {
  display: flex;
  flex-direction: column;
}

.folio-label, .date-label {
  font-size: 12px;
  color: #666;
}

.folio-number, .date-value {
  font-size: 16px;
  font-weight: bold;
}

/* SECCIONES FORMALES */
.formal-section {
  margin-bottom: 1.5rem;
}

.formal-section-title {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 10px 0;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-left: 4px solid #000;
  text-transform: uppercase;
}

.formal-section-content {
  padding: 0 10px;
}

/* TABLAS DE INFORMACIÓN */
.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.info-table td {
  padding: 5px;
  vertical-align: top;
}

.info-label {
  font-weight: bold;
  width: 20%;
}

.info-value {
  width: 30%;
}

/* TABLA FORMAL */
.formal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table-header {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 8px;
  font-weight: bold;
  text-align: left;
}

.table-cell {
  border: 1px solid #ddd;
  padding: 8px;
}

.text-center {
  text-align: center;
}

/* SECCIÓN DE COMENTARIOS */
.comments-box {
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 12px;
  min-height: 60px;
}

/* SECCIÓN DE FIRMAS */
.signature-section {
  margin-top: 2rem;
}

.signatures-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.signature-column {
  width: 45%;
  text-align: center;
}

.official-signature {
  width: 60%;
  margin: 1rem auto 0 auto;
  text-align: center;
}

.signature-role {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 40px;
}

.signature-line {
  border-bottom: 1px solid #000;
  margin: 0 auto 5px auto;
  width: 90%;
}

.signature-name {
  font-size: 12px;
  font-weight: bold;
  margin: 5px 0 2px 0;
}

.signature-label {
  font-size: 10px;
  margin: 0;
  color: #666;
}

/* PIE DE PÁGINA */
.footer {
  margin-top: 2rem;
  display: flex;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.official-seal {
  width: 100px;
  margin-right: 20px;
}

.seal-border {
  border: 1px dashed #666;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seal-text {
  font-size: 10px;
  text-align: center;
  color: #666;
}

.footer-text {
  flex: 1;
  font-size: 10px;
  color: #333;
}

.document-generated {
  font-style: italic;
  color: #666;
  margin-top: 15px;
}

.document-operator {
  font-weight: bold;
}

@media print {
  .btn {
    display: none;
  }
}
</style>