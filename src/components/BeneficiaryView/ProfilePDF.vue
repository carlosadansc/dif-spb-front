<template>
  <div id="beneficiary-profile">
    <div id="profile-content" class="ticket-content">
      <!-- Encabezado con escudo y logos institucionales -->
      <div class="pdf-header">
        <div class="logo-container">
          <img :src="logoDif" alt="Logo DIF" class="logo" />
          <div class="header-divider"></div>
          <img :src="logoAyunta" alt="Logo Ayuntamieto" class="logo-ayunta" />
        </div>
        <div class="document-title-container">
          <h1 class="document-type">PERFIL SOCIOECONOMICO X</h1>
          <h2 class="document-subtitle">REGISTRO DEL PADRON DE BENEFICIARIOS</h2>
        </div>
      </div>

      <!-- Información de folio y fecha -->
      <div class="document-info">
        <div class="folio-box">
          <span class="folio-label">CURP</span>
          <span class="folio-number">{{ props.beneficiary.curp }}</span>
        </div>
        <div class="date-box">
          <span class="date-label">FECHA DE EMISIÓN</span>
          <span class="date-value">{{ getCurrentDate(true) }}</span>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="content-container">
        <!-- Sección de información general -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN DEL BENEFICIARIO</h3>
          <div class="formal-section-content">
            <div class="beneficiary-header">
              <div class="beneficiary-photo-container" v-if="props.beneficiary.photo">
                <img :src="getPhotoUrl(props.beneficiary.photo)" alt="Foto del beneficiario" class="beneficiary-photo" />
              </div>
              <div class="beneficiary-info">
                <table class="info-table">
                  <tbody>
                    <tr>
                      <td class="info-label">NOMBRE COMPLETO:</td>
                      <td class="info-value" colspan="3">{{ props.beneficiary.name }} {{ props.beneficiary.fatherSurname }}
                        {{ props.beneficiary.motherSurname }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">EDAD:</td>
                      <td class="info-value">{{ props.beneficiary.age }} años</td>
                      <td class="info-label">FECHA DE NACIMIENTO:</td>
                      <td class="info-value">{{ formatDate(props.beneficiary.birthdate) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TELÉFONO:</td>
                      <td class="info-value">{{ props.beneficiary.phone }}</td>
                      <td class="info-label">LUGAR DE NACIMIENTO:</td>
                      <td class="info-value">{{ props.beneficiary.birthplace }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">SEXO:</td>
                      <td class="info-value">{{ props.beneficiary.sex === 'HOMBRE' ? 'Hombre' : 'Mujer' }}</td>
                      <td class="info-label">ESTADO CIVIL:</td>
                      <td class="info-value">{{ formatCivilStatus(props.beneficiary.civilStatus) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">ESCOLARIDAD:</td>
                      <td class="info-value">{{ props.beneficiary.scholarship }}</td>
                      <td class="info-label">DISCAPACIDAD:</td>
                      <td class="info-value">{{ props.beneficiary.hasDisability ? props.beneficiary.disabilityType :
                        'Ninguna' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de dirección -->
        <div class="formal-section">
          <h3 class="formal-section-title">DIRECCIÓN</h3>
          <div class="formal-section-content">
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="info-label">CALLE:</td>
                  <td class="info-value">{{ props.beneficiary.address.street }}</td>
                  <td class="info-label">NUM. EXT:</td>
                  <td class="info-value">{{ props.beneficiary.address.extNum }}</td>
                </tr>
                <tr>
                  <td class="info-label">NUM. INT:</td>
                  <td class="info-value">{{ props.beneficiary.address.intNum || 'N/A' }}</td>
                  <td class="info-label">COLONIA:</td>
                  <td class="info-value">{{ props.beneficiary.address.neighborhood }}</td>
                </tr>
                <tr>
                  <td class="info-label">CÓDIGO POSTAL:</td>
                  <td class="info-value">{{ props.beneficiary.address.cp }}</td>
                  <td class="info-label">CIUDAD:</td>
                  <td class="info-value">{{ props.beneficiary.address.city }}</td>
                </tr>
                <tr>
                  <td class="info-label">DELEGACIÓN:</td>
                  <td class="info-value">{{ props.beneficiary.address.delegation }}</td>
                  <td class="info-label">SUBDELEGACIÓN:</td>
                  <td class="info-value">{{ props.beneficiary.address.subdelegation }}</td>
                </tr>
                <tr>
                  <td class="info-label">TIPO DE COMUNIDAD:</td>
                  <td class="info-value" colspan="3">{{ props.beneficiary.address.communityType === 'RURAL' ? 'Rural' :
                    'Urbana' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Información del Cónyuge/Tutor -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN DEL {{ props.beneficiary.spouseOrTutor.relationship === 'CONYUGE'
            ? 'CÓNYUGE' : 'TUTOR' }}</h3>
          <div class="formal-section-content">
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="info-label">CURP:</td>
                  <td class="info-value" colspan="2">{{ props.beneficiary.spouseOrTutor.curp }}</td>
                </tr>
                <tr>
                  <td class="info-label">NOMBRE COMPLETO:</td>
                  <td class="info-value" colspan="3">{{ props.beneficiary.spouseOrTutor.fullname }}</td>
                </tr>
                <tr>
                  <td class="info-label">EDAD:</td>
                  <td class="info-value">{{ props.beneficiary.spouseOrTutor.age }} años</td>
                  <td class="info-label">TELÉFONO:</td>
                  <td class="info-value">{{ props.beneficiary.spouseOrTutor.phone }}</td>
                </tr>
                <tr>
                  <td class="info-label">TRABAJO:</td>
                  <td class="info-value">{{ props.beneficiary.spouseOrTutor.work }}</td>
                  <td class="info-label">INGRESOS:</td>
                  <td class="info-value">{{ formatCurrency(props.beneficiary.spouseOrTutor.income) }}</td>
                </tr>
                <tr v-if="props.beneficiary.spouseOrTutor.comments">
                  <td class="info-label">COMENTARIOS:</td>
                  <td class="info-value" colspan="3">{{ props.beneficiary.spouseOrTutor.comments }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Información de la Vivienda -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN DE LA VIVIENDA</h3>
          <div class="formal-section-content">
            <div class="info-grid">
              <div>
                <table class="info-table">
                  <tbody>
                    <tr>
                      <td class="info-label">TIPO:</td>
                      <td class="info-value">{{ props.beneficiary.home.type === 'CASA' ? 'Casa' : 'Departamento' }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">HABITACIONES:</td>
                      <td class="info-value">{{ props.beneficiary.home.roomNumber }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">PERTENENCIA:</td>
                      <td class="info-value">{{ formatBelonging(props.beneficiary.home.belonging) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TIPO DE PISO:</td>
                      <td class="info-value">{{ formatBelonging(props.beneficiary.home.floorType) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TIPO DE PARED:</td>
                      <td class="info-value">{{ formatBelonging(props.beneficiary.home.wallType) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TIPO DE TECHO:</td>
                      <td class="info-value">{{ formatBelonging(props.beneficiary.home.ceilingType) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p><strong>SERVICIOS:</strong></p>
                <ul class="services-list">
                  <li><strong>Baño:</strong>{{ props.beneficiary.home.haveBathroom ? ' Si' : ' No' }}</li>
                  <li><strong>Sanitario:</strong>{{ props.beneficiary.home.haveToilet ? ' Si' : ' No' }}</li>
                  <li><strong>Drenaje:</strong>{{ props.beneficiary.home.haveDrainage ? ' Si' : ' No' }}</li>
                  <li><strong>Fósa séptica:</strong>{{ props.beneficiary.home.haveSepticTank ? ' Si' : ' No' }}</li>
                  <li><strong>Agua potable:</strong>{{ props.beneficiary.home.waterService ? ' Si' : ' No' }}</li>
                  <li><strong>Servicio eléctrico:</strong>{{ props.beneficiary.home.electricService ? ' Si' : ' No' }}
                  </li>
                  <li><strong>Aire acondicionado:</strong>{{ props.beneficiary.home.haveAirConditioning ? ' Si' : ' No' }}
                  </li>
                  <li><strong>Servicio de TV:</strong>{{ props.beneficiary.home.haveTvService ? ' Si' : ' No' }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Económica -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN ECONÓMICA</h3>
          <div class="formal-section-content">
            <div class="info-grid">
              <div>
                <table class="info-table">
                  <tbody>
                    <tr>
                      <td class="info-label">OCUPACIÓN:</td>
                      <td class="info-value">{{ props.beneficiary.occupation }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">DESCRIPCIÓN LABORAL:</td>
                      <td class="info-value">{{ props.beneficiary.occupationDescription }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">INGRESOS MENSUALES:</td>
                      <td class="info-value">{{ formatCurrency(props.beneficiary.income) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p><strong>GASTOS MENSUALES:</strong></p>
                <ul class="expenses-list">
                  <li><strong>Transporte:</strong> {{ formatCurrency(props.beneficiary.expenses.transport) }}</li>
                  <li><strong>Alimentación:</strong> {{ formatCurrency(props.beneficiary.expenses.meal) }}</li>
                  <li><strong>Servicio de TV:</strong> {{ formatCurrency(props.beneficiary.expenses.tvService) }}</li>
                  <li><strong>Servicio de Agua:</strong> {{ formatCurrency(props.beneficiary.expenses.waterService) }}
                  </li>
                  <li><strong>Servicio Eléctrico:</strong> {{ formatCurrency(props.beneficiary.expenses.electricService)
                    }}</li>
                  <li><strong>Otros Gastos:</strong> {{ formatCurrency(props.beneficiary.expenses.otherExpenses) }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de comentarios si existen -->
        <div class="formal-section" v-if="props.beneficiary.comments">
          <h3 class="formal-section-title">COMENTARIOS / OBSERVACIONES</h3>
          <div class="formal-section-content">
            <div class="comments-box">
              {{ props.beneficiary.comments }}
            </div>
          </div>
        </div>

        <!-- Sección de firmas -->
        <div class="formal-section signature-section">
          <h3 class="formal-section-title">FIRMAS DE CONFORMIDAD</h3>
          <div class="formal-section-content">
            <div class="sign-text">
              <p class="text-center"><i>"Manifiesto bajo protesta de decir verdad que la información proporcionada en
                  este formato es verdadera y estoy de acuerdo a que se compruebe la veracidad de esta información."</i>
              </p>
            </div>

            <div class="signatures-container">
              <div class="signature-column">
                <p class="signature-role">BENEFICIARIO</p>
                <div class="signature-line"></div>
                <p class="signature-name">{{ props.beneficiary.name }} {{ props.beneficiary.fatherSurname }} {{
                  props.beneficiary.motherSurname }}</p>
                <p class="signature-label">NOMBRE Y FIRMA</p>
              </div>
              <div class="signature-column">
                <p class="signature-role">REALIZÓ</p>
                <div class="signature-line"></div>
                <p class="signature-name">{{ user.name }} {{ user.lastname }}</p>
                <p class="signature-label">{{ user.position }}</p>
              </div>
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
          <p>Este documento es válido como ficha oficial de registro del beneficiario en el Sistema Integral del Padron
            de Beneficiarios del DIF Municipal La Paz B.C.S.</p>
          <p class="document-generated">Documento generado el {{ getCurrentDate() }} a través del Sistema Integral
            del Padrón de Beneficiarios</p>
          <p class="document-operator">Expedido por: {{ capitalize(user.name) }} {{ capitalize(user.lastname) }} / {{
            user.position }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import formatCurrency from '@/utils/formatCurrency';
import { useDate } from '@/utils/dateTool';
import capitalize from '@/utils/capitalize';
import logoDif from '@/assets/img/logo-dif.png';
import logoAyunta from '@/assets/img/logo-ayunta.png';
import { useAuth } from '@/composables/useAuth';

// composables
const { user } = useAuth();
const { formatDatetime, getCurrentDate, formatDate } = useDate();

// props
const props = defineProps({
  beneficiary: {
    type: Object,
    required: true
  }
});

// computed
const beneficiaryFileName = computed(() => {
  return `ficha-beneficiario-${props.beneficiary.name}-${props.beneficiary.fatherSurname}-${props.beneficiary.motherSurname}`;
});

// methods
const formatCivilStatus = (status) => {
  const statusMap = {
    'CASADO': 'Casado',
    'SOLTERO': 'Soltero',
    'VIUDO': 'Viudo',
    'UNION_LIBRE': 'Unión Libre'
  };
  return statusMap[status] || status;
};

const formatBelonging = (belonging) => {
  const belongingMap = {
    'PROPIA': 'Propia',
    'RENTA': 'Renta',
    'HIPOTECADA': 'Hipotecada',
    'PRESTADA': 'Prestada'
  };
  return belongingMap[belonging] || belonging;
};

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000";
const getPhotoUrl = (photo) => {
  return apiEndpoint + photo;
};

const generateProfilePDF = async () => {
  const element = document.getElementById('profile-content');
  if (!element) return;

  await document.fonts.ready;

  // Función helper para limpiar estilos problemáticos
  const cleanStylesForCanvas = (doc) => {
    // Buscar y limpiar estilos problemáticos en el DOM clonado
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const computedStyles = {};

      // Convertir estilos inline a RGB si contienen oklch
      if (el.style && el.style.cssText) {
        const newStyle = el.style.cssText.replace(/oklch\([^)]+\)/g, 'rgb(0, 0, 0)');
        el.style.cssText = newStyle;
      }

      // Asegurar fuente consistente
      el.style.fontFamily = "'Arial', sans-serif";
    });

    // Eliminar o modificar hojas de estilo que puedan contener oklch
    const styleSheets = doc.getElementsByTagName('style');
    for (let i = 0; i < styleSheets.length; i++) {
      const style = styleSheets[i];
      if (style.innerHTML.includes('oklch') || style.innerHTML.includes('@tailwind')) {
        // Intentar reemplazar los valores oklch en lugar de eliminar toda la hoja de estilos
        style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, 'rgb(0, 0, 0)');
      }
    }
  };

  // Crear el documento PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // Obtener dimensiones de la página
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10; // 10mm de margen en todos los lados
  const contentWidth = pageWidth - (margin * 2);
  const contentHeight = pageHeight - (margin * 2);

  // Identificar todas las secciones
  const sections = element.querySelectorAll('.formal-section');

  // Procesar cada sección por separado
  let currentPage = 1;
  let yPosition = margin;
  let isFirstSection = true;

  // Opciones base para html2canvas
  const canvasOptions = {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    onclone: (clonedDoc) => {
      cleanStylesForCanvas(clonedDoc);
    }
  };

  try {
    // Agregar encabezado y folio solo en la primera página
    const headerElement = element.querySelector('.pdf-header');
    const documentInfo = element.querySelector('.document-info');

    if (headerElement && documentInfo) {
      // Procesar el encabezado
      const headerCanvas = await html2canvas(headerElement, canvasOptions);

      const headerImgData = headerCanvas.toDataURL('image/jpeg', 1.0);
      const headerImgWidth = contentWidth;
      const headerImgHeight = (headerCanvas.height * headerImgWidth) / headerCanvas.width;

      pdf.addImage(headerImgData, 'JPEG', margin, yPosition, headerImgWidth, headerImgHeight);
      yPosition += headerImgHeight + 5;

      // Procesar la información del documento
      const infoCanvas = await html2canvas(documentInfo, canvasOptions);

      const infoImgData = infoCanvas.toDataURL('image/jpeg', 1.0);
      const infoImgWidth = contentWidth;
      const infoImgHeight = (infoCanvas.height * infoImgWidth) / infoCanvas.width;

      pdf.addImage(infoImgData, 'JPEG', margin, yPosition, infoImgWidth, infoImgHeight);
      yPosition += infoImgHeight + 10;
    }

    // Procesar cada sección formal
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      try {
        // Renderizar la sección actual a un canvas
        const sectionCanvas = await html2canvas(section, canvasOptions);

        // Calcular dimensiones de la imagen
        const sectionImgWidth = contentWidth;
        const sectionImgHeight = (sectionCanvas.height * sectionImgWidth) / sectionCanvas.width;

        // Verificar si cabe en la página actual o necesitamos una nueva
        if (!isFirstSection && (yPosition + sectionImgHeight > pageHeight - margin)) {
          // No cabe, añadir nueva página
          pdf.addPage();
          currentPage++;
          yPosition = margin;

          // Opcional: Agregar un encabezado simplificado en las páginas adicionales
          if (currentPage > 1) {
            pdf.setFontSize(8);
            pdf.text(`Perfil Socioeconómico - ${props.beneficiary.name} ${props.beneficiary.fatherSurname} - Página ${currentPage}`, margin, margin - 3);
            pdf.line(margin, margin - 1, pageWidth - margin, margin - 1);
          }
        }

        // Añadir la sección al PDF
        const sectionImgData = sectionCanvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(sectionImgData, 'JPEG', margin, yPosition, sectionImgWidth, sectionImgHeight);

        // Actualizar la posición Y para la siguiente sección
        yPosition += sectionImgHeight + 5;
        isFirstSection = false;
      } catch (sectionError) {
        console.error(`Error processing section ${i}:`, sectionError);
        // Continuar con la siguiente sección si hay un error
        isFirstSection = false;
        continue;
      }
    }

    // Añadir pie de página
    const footerElement = element.querySelector('.footer');
    if (footerElement) {
      try {
        // Si no cabe en la página actual, añadir nueva página
        const footerCanvas = await html2canvas(footerElement, canvasOptions);

        const footerImgWidth = contentWidth;
        const footerImgHeight = (footerCanvas.height * footerImgWidth) / footerCanvas.width;

        if (yPosition + footerImgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        const footerImgData = footerCanvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(footerImgData, 'JPEG', margin, yPosition, footerImgWidth, footerImgHeight);
      } catch (footerError) {
        console.error("Error processing footer:", footerError);
      }
    }

    // Agregar metadatos al PDF
    pdf.setProperties({
      title: `Ficha de Beneficiario - ${props.beneficiary.name} ${props.beneficiary.fatherSurname}`,
      subject: 'Ficha Oficial de Beneficiario DIF Municipal',
      author: 'DIF Municipal La Paz B.C.S.',
      keywords: 'beneficiario, ficha, oficial',
      creator: 'Sistema del Padron de Beneficiarios'
    });

    pdf.save(`${beneficiaryFileName.value}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Puedes mostrar un mensaje de error al usuario aquí
    alert("Hubo un error al generar el PDF. Por favor intenta de nuevo.");
  }
};

// expose
defineExpose({ generateProfilePDF });
</script>

<style scoped>
#beneficiary-profile {
  font-family: 'Arial', sans-serif !important;
  position: fixed;
  left: -9999px;
  top: -9999px;
}

/* Beneficiary photo styles */
.beneficiary-header {
  display: flex;
  margin-bottom: 15px;
  gap: 20px;
}

.beneficiary-photo-container {
  width: 150px;
  height: 150px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  flex-shrink: 0;
  padding: 5px;
}

.beneficiary-photo {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.beneficiary-info {
  flex-grow: 1;
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

.logo,
.logo-ayunta {
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

.folio-box,
.date-box {
  display: flex;
  flex-direction: column;
}

.folio-label,
.date-label {
  font-size: 12px;
  color: #666;
}

.folio-number,
.date-value {
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

/* GRID CONTAINER */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
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

.sign-text {
  margin: 0 0 2rem 0;
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

/* LISTAS DE SERVICIOS Y GASTOS */
.services-list,
.expenses-list {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.services-list li,
.expenses-list li {
  font-size: 12px;
  margin: 3px 0;
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