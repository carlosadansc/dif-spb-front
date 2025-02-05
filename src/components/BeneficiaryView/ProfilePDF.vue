<template>
  <div id="pdf" ref="document">
    <div id="element-to-convert" style="font-family: 'Inter', sans-serif;">
      <div class="pdf-container">
        <!-- Agregamos el header con el logo -->
        <div class="pdf-header">
          <img :src="logoDif" alt="Logo DIF" class="logo" />
          <img :src="logoAyunta" alt="Logo Ayuntamieto" class="logo-ayunta" />
        </div>

        <h1 class="pdf-title">BENEFICIARIO: <span style="color: black;">{{ beneficiary.name }} {{ beneficiary.fatherSurname }} {{ beneficiary.motherSurname }} / {{ beneficiary.curp }}</span></h1>

        <div class="content-container">
          <!-- Información General -->
          <h2 class="section-title">Información General</h2>
          <div class="info-grid">
            <!-- <p><strong>Nombre:</strong> </p> -->
            <!-- <p><strong>CURP:</strong> </p> -->
            <p><strong>Edad:</strong> {{ beneficiary.age }} años</p>
            <p><strong>Fecha de Nacimiento:</strong> {{ formatDate(beneficiary.birthdate) }}</p>
            <p><strong>Lugar de Nacimiento:</strong> {{ beneficiary.birthplace }}</p>
            <p><strong>Sexo:</strong> {{ beneficiary.sex === 'HOMBRE' ? 'Hombre' : 'Mujer' }}</p>
            <p><strong>Teléfono:</strong> {{ beneficiary.phone }}</p>
            <p><strong>Estado Civil:</strong> {{ formatCivilStatus(beneficiary.civilStatus) }}</p>
            <p><strong>Escolaridad:</strong> {{ beneficiary.scholarship }}</p>
            <p v-if="beneficiary.hasDisability"><strong>Tipo de Discapacidad:</strong> {{ beneficiary.disabilityType }}</p>
          </div>

          <!-- divider -->
          <hr>

          <!-- Dirección -->
          <h2 class="section-title">Dirección</h2>
          <div class="info-grid">
            <p><strong>Tipo de Comunidad:</strong> {{ beneficiary.address.communityType === 'RURAL' ? 'Rural' : 'Urbana' }}</p>
            <p><strong>Delegación:</strong> {{ beneficiary.address.delegation }}</p>
            <p><strong>Subdelegación:</strong> {{ beneficiary.address.subdelegation }}</p>
            <p><strong>Calle:</strong> {{ beneficiary.address.street }}</p>
            <p><strong>Número Exterior:</strong> {{ beneficiary.address.extNum }}</p>
            <p><strong>Número Interior:</strong> {{ beneficiary.address.intNum || 'N/A' }}</p>
            <p><strong>Colonia:</strong> {{ beneficiary.address.neighborhood }}</p>
            <p><strong>Código Postal:</strong> {{ beneficiary.address.cp }}</p>
            <p><strong>Ciudad:</strong> {{ beneficiary.address.city }}</p>
          </div>

          <!-- divider -->
            <hr>

          <!-- Información del Cónyuge/Tutor -->
          <h2 class="section-title">Información del {{ beneficiary.spouseOrTutor.relationship === 'CONYUGE' ? 'Cónyuge' : 'Tutor' }}</h2>
          <div class="info-grid">
            <p><strong>Nombre:</strong> {{ beneficiary.spouseOrTutor.fullname }}</p>
            <p><strong>Edad:</strong> {{ beneficiary.spouseOrTutor.age }} años</p>
            <p><strong>Teléfono:</strong> {{ beneficiary.spouseOrTutor.phone }}</p>
            <p><strong>Trabajo:</strong> {{ beneficiary.spouseOrTutor.work }}</p>
            <p><strong>Ingresos:</strong> ${{ beneficiary.spouseOrTutor.income }}</p>
            <p v-if="beneficiary.spouseOrTutor.comments"><strong>Comentarios:</strong> {{ beneficiary.spouseOrTutor.comments }}</p>
          </div>

          <!-- divider -->
          <hr>

          <!-- Información de la Vivienda -->
          <h2 class="section-title">Información de la Vivienda</h2>
          <div class="info-grid">
            <div>
              <p><strong>Tipo:</strong> {{ beneficiary.home.type === 'CASA' ? 'Casa' : 'Departamento' }}</p>
              <p><strong>Número de Habitaciones:</strong> {{ beneficiary.home.roomNumber }}</p>
              <p><strong>Pertenencia:</strong> {{ formatBelonging(beneficiary.home.belonging) }}</p>
            </div>

            <div>
              <p><strong>Servicios:</strong></p>
            <ul class="services-list info-grid">
              <li><strong>Baño:</strong>{{beneficiary.home.haveBathroom ? ' Si' : ' No'}}</li>
              <li><strong>Sanitario:</strong>{{beneficiary.home.haveToilet ? ' Si' : ' No'}}</li>
              <li><strong>Drenaje:</strong>{{beneficiary.home.haveDrainage ? ' Si' : ' No'}}</li>
              <li><strong>Fósa séptica:</strong>{{beneficiary.home.haveSepticTank ? ' Si' : ' No'}}</li>
              <li><strong>Agua potable:</strong>{{beneficiary.home.waterService ? ' Si' : ' No'}}</li>
              <li><strong>Servicio eléctrico:</strong>{{beneficiary.home.electricService ? ' Si' : ' No'}}</li>
              <li><strong>Aire acondicionado:</strong>{{beneficiary.home.haveAirConditioning ? ' Si' : ' No'}}</li>
              <li><strong>Servicio de TV:</strong>{{beneficiary.home.haveTvService ? ' Si' : ' No'}}</li>
            </ul>
            </div>
          </div>

          <!-- divider -->
          <hr>

          <!-- Información Económica -->
          <h2 class="section-title">Información Económica</h2>
          <div class="info-grid">
            <div>
            <p><strong>Ocupación:</strong> {{ beneficiary.occupation }}</p>
            <p><strong>Descripción laboral:</strong> {{ beneficiary.occupationDescription }}</p>
            <p><strong>Ingresos Mensuales:</strong> {{ formatCurrency(beneficiary.income) }}</p>
            </div>
            
            <div>
              <p><strong>Gastos Mensuales:</strong></p>
              <ul class="expenses-list info-grid">
                <li><strong>Transporte:</strong> {{ formatCurrency(beneficiary.expenses.transport) }}</li>
                <li><strong>Alimentación:</strong> {{ formatCurrency(beneficiary.expenses.meal) }}</li>
                <li><strong>Servicio de TV:</strong> {{ formatCurrency(beneficiary.expenses.tvService) }}</li>
                <li><strong>Servicio de Agua:</strong> {{ formatCurrency(beneficiary.expenses.waterService) }}</li>
                <li><strong>Servicio Eléctrico:</strong> {{ formatCurrency(beneficiary.expenses.electricService) }}</li>
                <li><strong>Otros Gastos:</strong> {{ formatCurrency(beneficiary.expenses.otherExpenses) }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">
            Documento generado por el Sistema Integral del Padron de Apoyos del DIF Municipal La Paz B.C.S. 
            <span>{{ formatDate(new Date()) }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- <button class="btn" @click="exportToPDF">Exportar a PDF</button> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import '@fontsource/inter'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import formatCurrency from '@/utilities/formatCurrency'
import formatDate from '../../utilities/formatDate'
import logoDif from '@/assets/img/logo-dif.png'
import logoAyunta from '@/assets/img/logo-ayunta.png'

//props
const props = defineProps({
  beneficiary: {
    type: Object,
    required: true
  }
})

//computed
const beneficiaryFileName = computed(() => {
  return `ficha-beneficiario-${props.beneficiary.name}-${props.beneficiary.fatherSurname}-${props.beneficiary.motherSurname}`
})

const formatCivilStatus = (status) => {
  const statusMap = {
    'CASADO': 'Casado',
    'SOLTERO': 'Soltero',
    'VIUDO': 'Viudo',
    'UNION_LIBRE': 'Unión Libre'
  }
  return statusMap[status] || status
}

const formatBelonging = (belonging) => {
  const belongingMap = {
    'PROPIA': 'Propia',
    'RENTA': 'Renta',
    'HIPOTECADA': 'Hipotecada',
    'PRESTADA': 'Prestada'
  }
  return belongingMap[belonging] || belonging
}

const exportToPDF = async () => {
  try {
    const element = document.getElementById('element-to-convert')
    if (!element) return

    await document.fonts.ready

    const canvas = await html2canvas(element, {
      scale: 2,  // Aumentamos la escala para mejor calidad
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',
      windowWidth: 816, // Ancho de carta en pixels (8.5 x 96)
      windowHeight: 1056, // Alto de carta en pixels (11 x 96)
      onclone: (clonedDoc) => {
        const styles = clonedDoc.getElementsByTagName('style')
        for (let style of styles) {
          if (style.innerHTML.includes('@tailwind') || style.innerHTML.includes('oklch')) {
            style.remove()
          }
        }
        clonedDoc.body.style.fontFamily = "'Inter', sans-serif"
      }
    })

    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',  // Cambiamos a milímetros
      format: 'letter'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calculamos las dimensiones manteniendo la proporción
    const imgWidth = pageWidth - 20  // 10mm de margen en cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let heightLeft = imgHeight
    let position = 5 // 10mm de margen superior

    // Primera página
    pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Páginas adicionales
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 5
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`ficha-beneficiario-${props.beneficiary.name}-${props.beneficiary.fatherSurname}-${props.beneficiary.motherSurname}.pdf`)
  } catch (err) {
    console.error('Error generating PDF:', err)
  }
}

//expose
defineExpose({ exportToPDF });


//onMounted
onMounted(() => {
  document.fonts.ready.then(() => {
    // console.log('Fonts loaded')
  })
})

</script>

<style>
#element-to-convert {
  font-family: 'Inter', sans-serif !important;
  position: fixed;
  left: -9999px;
  top: -9999px;
}

#pdf {
  margin-top: 60px;
  text-align: center;
}

.pdf-container {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: left;
  max-width: 816px; /* Ancho de carta */
  margin: 0 auto;
}

.pdf-header {
  display: flex;
  justify-content: start;
  margin-bottom: 0.5rem;  /* Reducido de 1rem */
}

.logo {
  height: 36px;  /* Reducido de 36px */
  width: auto;
}

.logo-ayunta {
  height: 36px;  /* Reducido de 36px */
  width: auto;
  margin-left: 1rem;  /* Aumentado de 0.5rem */
}

.pdf-title {
  font-size: 16px;  /* Reducido de 16px */
  font-weight: 700;
  margin-bottom: 1rem;  /* Reducido de 1.5rem */
  color: rgb(153 27 27);
}

.content-container {
  font-size: 14px;  /* Reducido de 16px */
  line-height: 1.4;
}

.section-title {
  font-size: 14px;  /* Reducido de 14px */
  font-weight: 600;
  margin-top: 0.8rem;  /* Reducido de 1rem */
  margin-bottom: 0.4rem;  /* Reducido de 0.5rem */
  color: rgb(153, 27, 27);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;  /* Reducido de 0.35rem */
  margin-bottom: 0.8rem;  /* Reducido de 1rem */
}

.info-grid p {
  font-size: 12px;
  margin: 0;  /* Eliminamos el margen */
  line-height: 1;  /* Reducimos aún más el interlineado */
  padding: 2px 0;  /* Agregamos un pequeño padding en lugar de margin */
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 0.5rem;  /* Reducido de 1.5rem */
  margin-bottom: 0.3rem;  /* Reducido de 1rem */
  color: rgb(153, 27, 27);
}

.services-list, .expenses-list {
  margin: 0;
  line-height: 1.2;
  padding: 1px 0;  /* Reducido de 2px */
}

.services-list li, .expenses-list li {
  font-size: 12px;  /* Reducido de 16px */
  margin: 0;
  line-height: 1.2;
  padding: 1px 0;  /* Reducido de 2px */
}

.footer-text {
  font-size: 12px;  /* Reducido de 14px */
  color: #6b7280;
  text-align: center;
}

hr {
  margin: 0.5rem 0;  /* Reducido de 1rem */
  border: 0;
  border-top: 1px solid #e5e7eb;
}

/* .footer-text {
  font-size: 10px;
} */

strong {
  font-weight: 600;
}

.footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/*.footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}*/

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