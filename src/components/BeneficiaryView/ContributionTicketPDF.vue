<template>
  <div id="contribution-ticket">
    <div :id="`ticket-content-${contribution._id}`" class="ticket-content">
      <div class="pdf-header">
        <img :src="logoDif" alt="Logo DIF" class="logo" />
        <img :src="logoAyunta" alt="Logo Ayuntamieto" class="logo-ayunta" />
      </div>
      <h1 class="pdf-title">RECIBO DE ENTREGA DE APOYO</h1>
      <div class="content-container">
        <h2 class="section-title">Información del Beneficiario</h2>
        <div class="info-grid">
          <p><strong>Beneficiario:</strong> {{ contribution.beneficiary.name }} {{ contribution.beneficiary.fatherSurname }} {{ contribution.beneficiary.motherSurname }}</p>
          <p><strong>CURP:</strong> {{ contribution.beneficiary.curp }}</p>
          <p><strong>Fecha de Entrega:</strong> {{ formatDate(contribution.contributionDate) }}</p>
        </div>

        <hr>

        <h2 class="section-title">Detalles del Apoyo</h2>
        <div class="list-grid">
          <div v-for="(item, index) in contribution.contributionItems" :key="index" class="contribution-item">
            <p><strong>Tipo de Contribución:</strong> {{ item.contributionItem.category.name }}</p>
            <p><strong>Descripción:</strong> {{ item.contributionItem.description }}</p>
            <p><strong>Cantidad:</strong> {{ item.quantity }}</p>
          </div>
        </div>

        <hr>

        <div class="info-grid">
          <p v-if="contribution.comments"><strong>Comentarios:</strong> {{ contribution.comments }}</p>
        </div>

        <div class="footer">
          <div class="info-grid">
            <div>
              <p>Recibido por: ___________________________</p>
              <p class="name-receiver">{{ contribution.receiver }}</p>
            </div>
            <p>Firma del Responsable: ___________________________</p>
          </div>
          <p class="footer-text">
            Documento generado por el Sistema Integral del Padron de Apoyos del DIF Municipal La Paz B.C.S.
            <span>{{ formatDate(new Date()) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import formatDate from '../../utilities/formatDate';
import logoDif from '@/assets/img/logo-dif.png';

const props = defineProps({
  contribution: {
    type: Object,
    required: true
  }
});


//methods
const generateTicketPDF = async () => {
  console.log(props.contribution)
  const element = document.getElementById(`ticket-content-${props.contribution._id}`);
  if (!element) return;

  await document.fonts.ready;

  const canvas = await html2canvas(element, {
    scale: 2,
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
      clonedDoc.body.style.fontFamily = "'Inter', sans-serif";
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
  let position = 5;

  pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight + 5;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`recibo-contribucion-${props.contribution.beneficiary.name}-${props.contribution.beneficiary.fatherSurname}-${props.contribution.beneficiary.motherSurname}.pdf`);
};

//expose
defineExpose({ generateTicketPDF });

</script>

<style>
#contribution-ticket {
  font-family: 'Inter', sans-serif !important;
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.ticket-content {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: left;
  max-width: 816px;
  margin: 0 auto;
}

.pdf-header {
  display: flex;
  justify-content: start;
  margin-bottom: 0.5rem;
}

.logo {
  height: 36px;
  width: auto;
}

.logo-ayunta {
  height: 36px;
  width: auto;
  margin-left: 1rem;
}

.pdf-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 1rem;
  color: rgb(153 27 27);
}

.content-container {
  font-size: 14px;
  line-height: 1.4;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 0.8rem;
  margin-bottom: 0.4rem;
  color: rgb(153, 27, 27);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.8rem;
}

.list-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  margin-bottom: 0.8rem;
}

.info-grid p {
  font-size: 12px;
  margin: 0;
  line-height: 1;
  padding: 2px 0;
}

.list-grid p {
  font-size: 12px;
  margin: 0;
  line-height: 1;
  padding: 2px 0;
}

.name-receiver {
  width: 100%;
  text-align: center;
}

.contribution-item {
  margin-bottom: 0.25rem;
}

hr {
  margin: 0.5rem 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
}

.footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.footer p {
  margin: 0.5rem 0;
  font-size: 12px;
}

.footer-text {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

strong {
  font-weight: 600;
}

@media print {
  .btn {
    display: none;
  }
}
</style>