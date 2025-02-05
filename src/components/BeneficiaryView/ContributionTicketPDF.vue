<template>
  <div id="contribution-ticket">
    <div id="ticket-content" class="ticket-content">
      <div class="header">
        <img :src="logoDif" alt="Logo DIF" class="logo" />
        <h6>Recibo de entrega de apoyo</h6>
      </div>
      <div class="content">
        <p><strong>Beneficiario:</strong> {{ contribution.beneficiary.name }} {{ contribution.beneficiary.fatherSurname
          }} {{ contribution.beneficiary.motherSurname }}</p>
        <p><strong>CURP:</strong> {{ contribution.beneficiary.curp }}</p>
        <p><strong>Fecha de Entrega:</strong> {{ formatDate(contribution.contributionDate) }}</p>
        <div v-for="(item, index) in contribution.contributionItems" :key="index" class="contribution-item">
          <p><strong>Tipo de Contribución:</strong> {{ item.contributionItem.category.name }}</p>
          <p><strong>Descripción:</strong> {{ item.contributionItem.description }}</p>
          <p><strong>Cantidad:</strong> {{ item.quantity }}</p>
        </div>
        <p><strong>Recibió:</strong> {{ contribution.receiver }}</p>
        <p v-if="contribution.comments"><strong>Comentarios:</strong> {{ contribution.comments }}</p>
      </div>
      <div class="footer">
        <p>Firma del Beneficiario: ___________________________</p>
        <p>Firma del Responsable: ___________________________</p>
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
  const element = document.getElementById('ticket-content');
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

<style lang="scss" scoped>
#contribution-ticket {
  font-family: 'Inter', sans-serif !important;
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.ticket-content {
  padding: 20px;
  background-color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  margin-bottom: 10px;
}

.content {
  margin-top: 20px;
}

.contribution-item {
  margin-bottom: 10px;
}

.footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.footer p {
  margin: 10px 0;
}

.btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1f2937;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
}

@media print {
  .btn {
    display: none;
  }
}
</style>