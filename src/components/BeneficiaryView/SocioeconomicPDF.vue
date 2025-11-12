<template>
  <div id="socioeconomic-study" v-if="props.beneficiary && props.assessment">
    <div id="study-content" class="ticket-content">
      <!-- Encabezado con escudo y logos institucionales -->
      <div class="pdf-header" id="pdf-header-section">
        <div class="logo-container">
          <img :src="logoDif" alt="Logo DIF" class="logo" />
          <div class="header-divider"></div>
          <img :src="logoAyunta" alt="Logo Ayuntamiento" class="logo-ayunta" />
        </div>
        <div class="document-title-container">
          <h1 class="document-type">ESTUDIO SOCIOECONOMICO</h1>
          <h2 class="document-subtitle">BENEFICIARIO SISTEMA DIF MUNICIPAL DE LA PAZ BAJA CALIFORNIA SUR</h2>
        </div>
      </div>

      <!-- Información de folio y fecha -->
      <div class="document-info" id="pdf-document-info">
        <div class="folio-box">
          <span class="folio-label">FOLIO N°</span>
          <span class="folio-number">{{ props.assessment.folio }}</span>
        </div>
        <div class="date-box">
          <span class="date-label">FECHA DE EMISIÓN</span>
          <span class="date-value">{{ formatDate(props.assessment.assessmentDate) }}</span>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="content-container">
        <!-- Sección de información general -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN DEL BENEFICIARIO</h3>
          <div class="formal-section-content">
            <div class="beneficiary-header">
              <div class="beneficiary-photo-container" v-if="props.assessment.beneficiary.photo">
                <img :src="getPhotoUrl(props.assessment.beneficiary.photo)" alt="Foto del beneficiario" class="beneficiary-photo" />
              </div>
              <div class="beneficiary-info">
                <table class="info-table">
                  <tbody>
                    <tr>
                      <td class="info-label">CURP:</td>
                      <td class="info-value" colspan="3">{{ props.assessment.beneficiary.curp }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">NOMBRE COMPLETO:</td>
                      <td class="info-value" colspan="3">{{ props.assessment.beneficiary.name }} {{ props.assessment.beneficiary.fatherSurname }} {{ props.assessment.beneficiary.motherSurname }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">EDAD:</td>
                      <td class="info-value">{{ props.assessment.beneficiary.age }} años</td>
                      <td class="info-label">FECHA DE NACIMIENTO:</td>
                      <td class="info-value">{{ formatDate(props.assessment.beneficiary.birthdate) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TELÉFONO:</td>
                      <td class="info-value">{{ props.assessment.beneficiary.phone }}</td>
                      <td class="info-label">LUGAR DE NACIMIENTO:</td>
                      <td class="info-value">{{ props.assessment.beneficiary.birthplace }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">SEXO:</td>
                      <td class="info-value">{{ props.assessment.beneficiary.sex === 'HOMBRE' ? 'Hombre' : 'Mujer' }}</td>
                      <td class="info-label">ESTADO CIVIL:</td>
                      <td class="info-value">{{ formatCivilStatus(props.assessment.snapshot.civilStatus) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">ESCOLARIDAD:</td>
                      <td class="info-value">{{ props.assessment.snapshot.scholarship }}</td>
                      <td class="info-label">DISCAPACIDAD:</td>
                      <td class="info-value">{{ props.assessment.beneficiary.hasDisability ? props.assessment.beneficiary.disabilityType : 'Ninguna' }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">SERVICIO MEDICO:</td>
                      <td class="info-value">{{ props.assessment.snapshot.medicalService }}</td>
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
                  <td class="info-value">{{ props.assessment.snapshot.address.street }}</td>
                  <td class="info-label">NUM. EXT:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.extNum }}</td>
                </tr>
                <tr>
                  <td class="info-label">NUM. INT:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.intNum || 'N/A' }}</td>
                  <td class="info-label">COLONIA:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.neighborhood }}</td>
                </tr>
                <tr>
                  <td class="info-label">CÓDIGO POSTAL:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.cp }}</td>
                  <td class="info-label">CIUDAD:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.city }}</td>
                </tr>
                <tr>
                  <td class="info-label">DELEGACIÓN:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.delegation }}</td>
                  <td class="info-label">SUBDELEGACIÓN:</td>
                  <td class="info-value">{{ props.assessment.snapshot.address.subdelegation }}</td>
                </tr>
                <tr>
                  <td class="info-label">TIPO DE COMUNIDAD:</td>
                  <td class="info-value" colspan="3">{{ props.assessment.snapshot.address.communityType === 'RURAL' ? 'Rural' : 'Urbana' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Información del Cónyuge/Tutor -->
        <div class="formal-section">
          <h3 class="formal-section-title">INFORMACIÓN DEL {{ props.assessment.snapshot.spouseOrTutor.relationship === 'CONYUGE' ? 'CÓNYUGE' : 'TUTOR' }}</h3>
          <div class="formal-section-content">
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="info-label">CURP:</td>
                  <td class="info-value" colspan="3">{{ props.assessment.snapshot.spouseOrTutor.curp }}</td>
                </tr>
                <tr>
                  <td class="info-label">NOMBRE COMPLETO:</td>
                  <td class="info-value" colspan="3">{{ props.assessment.snapshot.spouseOrTutor.fullname }}</td>
                </tr>
                <tr>
                  <td class="info-label">EDAD:</td>
                  <td class="info-value">{{ props.assessment.snapshot.spouseOrTutor.age }} años</td>
                  <td class="info-label">TELÉFONO:</td>
                  <td class="info-value">{{ props.assessment.snapshot.spouseOrTutor.phone }}</td>
                </tr>
                <tr>
                  <td class="info-label">TRABAJO:</td>
                  <td class="info-value">{{ props.assessment.snapshot.spouseOrTutor.work }}</td>
                  <td class="info-label">INGRESOS:</td>
                  <td class="info-value">{{ formatCurrency(props.assessment.snapshot.spouseOrTutor.income) }}</td>
                </tr>
                <tr v-if="props.assessment.snapshot.spouseOrTutor.comments">
                  <td class="info-label">COMENTARIOS:</td>
                  <td class="info-value" colspan="3">{{ props.assessment.snapshot.spouseOrTutor.comments }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Información de Familiares -->
        <div class="formal-section" v-if="props.assessment.snapshot.familyMembers && props.assessment.snapshot.familyMembers.length > 0">
          <h3 class="formal-section-title">INFORMACIÓN DE FAMILIARES</h3>
          <div class="formal-section-content">
            <div v-for="(member, index) in props.assessment.snapshot.familyMembers" :key="index" class="family-member">
              <h4 class="text-xs">Familiar #{{ index + 1 }}</h4>
              <table class="info-table">
                <tbody>
                  <tr>
                    <td class="info-label">NOMBRE COMPLETO:</td>
                    <td class="info-value" colspan="3">{{ (member.name + ' ' + member.lastname) || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="info-label">EDAD:</td>
                    <td class="info-value">{{ member.age }} años</td>
                    <td class="info-label">PARENTESCO:</td>
                    <td class="info-value">{{ member.relationship }}</td>
                  </tr>
                  <tr>
                    <td class="info-label">OCUPACIÓN:</td>
                    <td class="info-value">{{ member.occupation || 'No especificada' }}</td>
                    <td class="info-label">INGRESOS:</td>
                    <td class="info-value">{{ member.income ? formatCurrency(member.income) : 'No especificado' }}</td>
                  </tr>
                  <tr v-if="member.comments">
                    <td class="info-label">COMENTARIOS:</td>
                    <td class="info-value" colspan="3">{{ member.comments }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                      <td class="info-value">{{ props.assessment.snapshot.home.type === 'CASA' ? 'Casa' : 'Departamento' }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">HABITACIONES:</td>
                      <td class="info-value">{{ props.assessment.snapshot.home.roomNumber }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">PERTENENCIA:</td>
                      <td class="info-value">{{ formatBelonging(props.assessment.snapshot.home.belonging) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TIPO DE PISO:</td>
                      <td class="info-value">{{ formatBelonging(props.assessment.snapshot.home.floorType) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TIPO DE PARED:</td>
                      <td class="info-value">{{ formatBelonging(props.assessment.snapshot.home.wallType) }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">TIPO DE TECHO:</td>
                      <td class="info-value">{{ formatBelonging(props.assessment.snapshot.home.ceilingType) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p class="section-subtitle"><strong>SERVICIOS:</strong></p>
                <ul class="services-list">
                  <li><strong>Baño:</strong>{{ props.assessment.snapshot.home.haveBathroom ? ' Si' : ' No' }}</li>
                  <li><strong>Sanitario:</strong>{{ props.assessment.snapshot.home.haveToilet ? ' Si' : ' No' }}</li>
                  <li><strong>Drenaje:</strong>{{ props.assessment.snapshot.home.haveDrainage ? ' Si' : ' No' }}</li>
                  <li><strong>Fosa séptica:</strong>{{ props.assessment.snapshot.home.haveSepticTank ? ' Si' : ' No' }}</li>
                  <li><strong>Agua potable:</strong>{{ props.assessment.snapshot.home.waterService ? ' Si' : ' No' }}</li>
                  <li><strong>Servicio eléctrico:</strong>{{ props.assessment.snapshot.home.electricService ? ' Si' : ' No' }}</li>
                  <li><strong>Aire acondicionado:</strong>{{ props.assessment.snapshot.home.haveAirConditioning ? ' Si' : ' No' }}</li>
                  <li><strong>Servicio de TV:</strong>{{ props.assessment.snapshot.home.haveTvService ? ' Si' : ' No' }}</li>
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
                      <td class="info-value">{{ props.assessment.snapshot.occupation }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">DESCRIPCIÓN LABORAL:</td>
                      <td class="info-value">{{ props.assessment.snapshot.occupationDescription }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">INGRESOS MENSUALES:</td>
                      <td class="info-value">{{ formatCurrency(props.assessment.snapshot.income) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p class="section-subtitle"><strong>GASTOS MENSUALES:</strong></p>
                <ul class="expenses-list">
                  <li><strong>Transporte:</strong> {{ formatCurrency(props.assessment.snapshot.expenses.transport) }}</li>
                  <li><strong>Alimentación:</strong> {{ formatCurrency(props.assessment.snapshot.expenses.meal) }}</li>
                  <li><strong>Servicio de TV:</strong> {{ formatCurrency(props.assessment.snapshot.expenses.tvService) }}</li>
                  <li><strong>Servicio de Agua:</strong> {{ formatCurrency(props.assessment.snapshot.expenses.waterService) }}</li>
                  <li><strong>Servicio Eléctrico:</strong> {{ formatCurrency(props.assessment.snapshot.expenses.electricService) }}</li>
                  <li><strong>Otros Gastos:</strong> {{ formatCurrency(props.assessment.snapshot.expenses.otherExpenses) }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de comentarios si existen -->
        <div class="formal-section" v-if="props.assessment.notes">
          <h3 class="formal-section-title">COMENTARIOS / OBSERVACIONES</h3>
          <div class="formal-section-content">
            <div class="comments-box">
              {{ props.assessment.notes }}
            </div>
          </div>
        </div>

        <!-- Sección de firmas -->
        <div class="formal-section signature-section">
          <h3 class="formal-section-title">FIRMAS DE CONFORMIDAD</h3>
          <div class="formal-section-content">
            <div class="sign-text">
              <p class="text-center"><i>"Manifiesto bajo protesta de decir verdad que la información proporcionada en este formato es verdadera y estoy de acuerdo a que se compruebe la veracidad de esta información."</i></p>
            </div>

            <div class="signatures-container">
              <div class="signature-column">
                <p class="signature-role">BENEFICIARIO</p>
                <div class="signature-line"></div>
                <p class="signature-name">{{ props.beneficiary.name }} {{ props.beneficiary.fatherSurname }} {{ props.beneficiary.motherSurname }}</p>
                <p class="signature-label">NOMBRE Y FIRMA</p>
              </div>
              <div class="signature-column">
                <p class="signature-role">REALIZÓ</p>
                <div class="signature-line"></div>
                <p class="signature-name">{{ props.assessment.createdBy.name }} {{ props.assessment.createdBy.lastname }}</p>
                <p class="signature-label">{{ props.assessment.createdBy.position }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie de página (FUERA de content-container) -->
      <div class="footer" id="pdf-footer">
        <div class="official-seal">
          <div class="seal-border">
            <p class="seal-text">SELLO OFICIAL</p>
          </div>
        </div>
        <div class="footer-text">
          <p>Este documento es válido como estudio socioeconómico del beneficiario en el Sistema del Padrón de Beneficiarios del DIF Municipal La Paz Baja California Sur.</p>
          <p class="document-generated">Documento generado el {{ getCurrentDate() }} a través del Sistema del Padrón de Beneficiarios (SPB DIF La Paz)</p>
          <p class="document-operator">Expedido por: {{ user.name }} {{ user.lastname }} / {{ capitalize(user.position) }}</p>
        </div>
      </div>

      <div class="privacy-section" id="pdf-privacy">
      <!-- Aviso de Privacidad -->
          <div class="privacy-notice">
            <h4 class="privacy-title">AVISO DE PRIVACIDAD - SISTEMA DEL PADRÓN DE BENEFICIARIOS SMDIF LA PAZ</h4>
            <div class="privacy-content">
              <p><strong>Responsable de la protección de sus datos personales:</strong> Sistema para el Desarrollo Integral de la Familia del Municipio de La Paz, Baja California Sur (DIF Municipal La Paz), con domicilio en calle Nayarit 490, Col. Pueblo Nuevo, La Paz Baja California Sur, CP: 23060, teléfono 612 125 8400, correo electrónico dif@lapaz.gob.mx.</p>
              
              <p><strong>Finalidades del tratamiento de sus datos personales:</strong> Los datos personales recabados serán utilizados para las siguientes finalidades:</p>
              <ul class="privacy-list">
                <li>Identificar y dar seguimiento a los beneficiarios de los programas sociales</li>
                <li>Evaluar el estatus socioeconómico de los solicitantes</li>
                <li>Dar cumplimiento a las obligaciones legales del DIF Municipal</li>
                <li>Generar estadísticas para la mejora de los programas sociales</li>
                <li>Mantener actualizado el padrón de beneficiarios</li>
                <li>Realizar estudios socioeconómicos</li>
                <li>Proporcionar atención y seguimiento a los servicios solicitados</li>
              </ul>

              <p><strong>Datos personales recabados:</strong></p>
              <ul class="privacy-list">
                <li>Datos de identificación (nombre completo, CURP, fecha de nacimiento, género, etc.)</li>
                <li>Datos de contacto (domicilio, teléfono, correo electrónico)</li>
                <li>Datos socioeconómicos (ingresos, ocupación, composición familiar)</li>
                <li>Datos de salud (cuando aplique)</li>
                <li>Datos académicos (cuando aplique)</li>
              </ul>

              <p><strong>Transferencia de datos personales:</strong> Sus datos personales podrán ser compartidos con dependencias gubernamentales vinculadas a la prestación de servicios sociales, siempre que se encuentre previsto en las disposiciones legales aplicables y con el fin de dar cumplimiento a las obligaciones legales del DIF Municipal de La Paz Baja California Sur.</p>
              
              <p><strong>Derechos ARCO:</strong> Usted tiene derecho de Acceder a sus datos personales que poseemos y a los detalles de su tratamiento, así como a Rectificarlos en caso de ser inexactos o incompletos; Cancelarlos cuando considere que no se requieren para alguna de las finalidades señaladas en el presente aviso de privacidad, estén siendo utilizados para finalidades no consentidas o haya finalizado la relación de servicio, o bien, Oponerse al tratamiento de los mismos para fines específicos.</p>
              
              <p><strong>Revocación del consentimiento:</strong> Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Sin embargo, es importante que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos personales.</p>
              
              <p><strong>Cambios al aviso de privacidad:</strong> El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales; de nuestras propias necesidades por los productos o servicios que ofrecemos; de nuestras prácticas de privacidad; de cambios en nuestro modelo de negocio, o por otras causas. Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad.</p>
              
              <p><strong>Medios para ejercer sus derechos ARCO:</strong> Para ejercer cualquiera de los derechos ARCO, deberá presentar su solicitud a través del Sistema de Solicitudes de Acceso, Rectificación, Cancelación y Oposición (SISARCO) del INAI o directamente en las oficinas del DIF Municipal de La Paz Baja California Sur.</p>
              
              <p class="privacy-version">Versión: 1.0 - Fecha de última actualización: {{ '31 de Octubre de 2025' }}</p>
              
              <p class="privacy-note"><em>Nota: Este aviso de privacidad está sujeto a las disposiciones de la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados y demás normatividad aplicable.</em></p>
            </div>
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
  },
  assessment: {
    type: Object,
    required: false
  }
});

// computed
const beneficiaryFileName = computed(() => {
  return `estudio-socioeconomico-${props.assessment.folio}`;
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
    'PRESTADA': 'Prestada',
    'CONCRETO': 'Concreto',
    'TIERRA': 'Tierra',
    'MADERA': 'Madera',
    'LAMINA': 'Lámina',
    'BLOCK': 'Block',
    'ADOBE': 'Adobe',
    'CARTON': 'Cartón'
  };
  return belongingMap[belonging] || belonging;
};

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000";
const getPhotoUrl = (photo) => {
  return apiEndpoint + photo;
};

const generateSocioeconomicPDF = async () => {
  console.log('Starting PDF generation...');
  const container = document.getElementById('socioeconomic-study');
  const element = document.getElementById('study-content');
  
  if (!element || !container) {
    console.error('Elements not found');
    return;
  }
  
  // Hacer el elemento completamente visible temporalmente
  container.classList.add('generating');
  
  console.log('Element made visible, waiting for render...');
  await document.fonts.ready;
  
  // Esperar a que se renderice completamente
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verificar que las secciones tengan dimensiones
  const testSection = element.querySelector('.formal-section');
  if (testSection) {
    const rect = testSection.getBoundingClientRect();
    console.log('Test section dimensions:', rect.width, 'x', rect.height);
    if (rect.width === 0 || rect.height === 0) {
      console.error('Sections have zero dimensions!');
      container.classList.remove('generating');
      return;
    }
  }

  // Función helper para limpiar estilos problemáticos
  const cleanStylesForCanvas = (doc) => {
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.style && el.style.cssText) {
        const newStyle = el.style.cssText.replace(/oklch\([^)]+\)/g, 'rgb(0, 0, 0)');
        el.style.cssText = newStyle;
      }
      el.style.fontFamily = "'Arial', sans-serif";
    });

    const styleSheets = doc.getElementsByTagName('style');
    for (let i = 0; i < styleSheets.length; i++) {
      const style = styleSheets[i];
      if (style.innerHTML.includes('oklch') || style.innerHTML.includes('@tailwind')) {
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
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);

  // Identificar todas las secciones
  const sections = element.querySelectorAll('.formal-section');

  // Variables para control de paginación
  let currentPage = 1;
  let yPosition = margin;
  let isFirstSection = true;

  // Opciones base para html2canvas
  const canvasOptions = {
    scale: 2,
    useCORS: true,
    logging: true,
    backgroundColor: '#ffffff',
    allowTaint: false,
    removeContainer: false,
    foreignObjectRendering: false,
    onclone: (clonedDoc) => {
      console.log('Cloning document...');
      cleanStylesForCanvas(clonedDoc);
    }
  };

  try {
    console.log('Starting to process PDF content...');
    
    // 1. PROCESAR ENCABEZADO Y DOCUMENTO INFO
    // 1. PROCESAR ENCABEZADO Y DOCUMENTO INFO
    const headerElement = element.querySelector('.pdf-header');
    const documentInfo = element.querySelector('.document-info');
    
    if (!headerElement || !documentInfo) {
      console.error('Header or document info elements not found');
      return;
    }

    // Process header first
    console.log('📋 Processing header...');
    console.log('Header element dimensions:', headerElement.offsetWidth, 'x', headerElement.offsetHeight);
    
    const headerCanvas = await html2canvas(headerElement, canvasOptions);
    
    console.log('Header canvas dimensions:', headerCanvas.width, 'x', headerCanvas.height);
    
    if (headerCanvas && headerCanvas.width > 0 && headerCanvas.height > 0) {
      const headerImgData = headerCanvas.toDataURL('image/png', 1.0);
      const headerImgWidth = contentWidth;
      const headerImgHeight = (headerCanvas.height * headerImgWidth) / headerCanvas.width;

      if (isFinite(headerImgHeight) && headerImgHeight > 0) {
        pdf.addImage(headerImgData, 'PNG', margin, yPosition, headerImgWidth, headerImgHeight);
        yPosition += headerImgHeight + 5;
        console.log('✅ Header added successfully, new Y position:', yPosition);
      } else {
        console.error('❌ Header height is invalid:', headerImgHeight);
      }
    } else {
      console.error('❌ Header canvas is invalid or has zero dimensions');
    }

    // Process document info
    console.log('📄 Processing document info...');
    console.log('Info element dimensions:', documentInfo.offsetWidth, 'x', documentInfo.offsetHeight);
    console.log('Info display:', window.getComputedStyle(documentInfo).display);
    console.log('Info visibility:', window.getComputedStyle(documentInfo).visibility);
    
    const infoCanvas = await html2canvas(documentInfo, canvasOptions);
    
    console.log('Info canvas dimensions:', infoCanvas.width, 'x', infoCanvas.height);
    
    if (infoCanvas && infoCanvas.width > 0 && infoCanvas.height > 0) {
      const infoImgData = infoCanvas.toDataURL('image/png', 1.0);
      const infoImgWidth = contentWidth;
      const infoImgHeight = (infoCanvas.height * infoImgWidth) / infoCanvas.width;

      if (isFinite(infoImgHeight) && infoImgHeight > 0) {
        pdf.addImage(infoImgData, 'PNG', margin, yPosition, infoImgWidth, infoImgHeight);
        yPosition += infoImgHeight + 10;
        console.log('✅ Document info added successfully, new Y position:', yPosition);
      } else {
        console.error('❌ Info height is invalid:', infoImgHeight);
      }
    } else {
      console.error('❌ Info canvas is invalid or has zero dimensions');
    }

    // 2. PROCESAR CADA SECCIÓN
    console.log(`Found ${sections.length} sections to process`);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      console.log(`Processing section ${i + 1}/${sections.length}...`);
      console.log(`Section ${i + 1} element dimensions:`, section.offsetWidth, 'x', section.offsetHeight);

      try {
        const sectionCanvas = await html2canvas(section, canvasOptions);
        
        console.log(`Section ${i + 1} canvas dimensions:`, sectionCanvas.width, 'x', sectionCanvas.height);
        
        if (!sectionCanvas || sectionCanvas.width === 0 || sectionCanvas.height === 0) {
          console.warn(`Section ${i + 1} has invalid canvas dimensions, skipping...`);
          continue;
        }

        const sectionImgWidth = contentWidth;
        const sectionImgHeight = (sectionCanvas.height * sectionImgWidth) / sectionCanvas.width;

        if (!isFinite(sectionImgHeight) || sectionImgHeight <= 0) {
          console.warn(`Section ${i + 1} has invalid calculated height, skipping...`);
          continue;
        }

        // Verificar si cabe en la página actual
        if (!isFirstSection && (yPosition + sectionImgHeight > pageHeight - margin)) {
          console.log(`Section ${i + 1} doesn't fit, adding new page...`);
          pdf.addPage();
          currentPage++;
          yPosition = margin;

          // El encabezado se agregará después de todo el contenido
        // para asegurar que esté en todas las páginas
        }

        const sectionImgData = sectionCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(sectionImgData, 'PNG', margin, yPosition, sectionImgWidth, sectionImgHeight);
        yPosition += sectionImgHeight + 5;
        isFirstSection = false;
        
        console.log(`Section ${i + 1} processed successfully, new Y position:`, yPosition);
      } catch (sectionError) {
        console.error(`Error processing section ${i + 1}:`, sectionError);
        continue;
      }
    }

    // 3. AÑADIR PIE DE PÁGINA
    console.log('Processing footer...');
    console.log('Current Y position before footer:', yPosition);
    const footerElement = element.querySelector('#pdf-footer');
    
    if (!footerElement) {
      console.error('Footer element not found with #pdf-footer!');
      // Intentar con selector alternativo
      const footerAlt = element.querySelector('.footer');
      console.log('Trying alternate selector .footer:', footerAlt);
    } else {
      console.log('✅ Footer element found');
      console.log('Footer innerHTML length:', footerElement.innerHTML.length);
      console.log('Footer text content length:', footerElement.textContent.length);
      
      try {
        console.log('Footer element dimensions:', footerElement.offsetWidth, 'x', footerElement.offsetHeight);
        console.log('Footer computed display:', window.getComputedStyle(footerElement).display);
        console.log('Footer computed visibility:', window.getComputedStyle(footerElement).visibility);
        
        const footerCanvas = await html2canvas(footerElement, canvasOptions);
        
        console.log('Footer canvas dimensions:', footerCanvas.width, 'x', footerCanvas.height);

        if (footerCanvas && footerCanvas.width > 0 && footerCanvas.height > 0) {
          const footerImgWidth = contentWidth;
          const footerImgHeight = (footerCanvas.height * footerImgWidth) / footerCanvas.width;

          if (isFinite(footerImgHeight) && footerImgHeight > 0) {
            console.log('Footer calculated height:', footerImgHeight, 'mm');
            console.log('Space needed:', yPosition + footerImgHeight, 'mm | Available:', pageHeight - margin, 'mm');
            
            if (yPosition + footerImgHeight > pageHeight - margin) {
              console.log('⚠️ Footer needs new page');
              pdf.addPage();
              currentPage++;
              yPosition = margin;
            }

            const footerYPosition = yPosition;
            const footerImgData = footerCanvas.toDataURL('image/png', 1.0);
            
            // Verificar que la imagen tiene datos
            console.log('Footer image data length:', footerImgData.length, 'bytes');
            
            pdf.addImage(footerImgData, 'PNG', margin, yPosition, footerImgWidth, footerImgHeight);
            yPosition += footerImgHeight + 5;
            console.log('✅ Footer added successfully at Y:', footerYPosition, 'mm | New Y position:', yPosition, 'mm');
          } else {
            console.error('❌ Footer height is invalid:', footerImgHeight);
          }
        } else {
          console.error('❌ Footer canvas is invalid or has zero dimensions');
        }
      } catch (footerError) {
        console.error("❌ Error processing footer:", footerError);
      }      
    }

    //4. AÑADIR AVISO DE PRIVACIDAD (inmediatamente después del footer)
    console.log('Processing privacy notice...');
    const privacyElement = element.querySelector('#pdf-privacy');
    
    if (privacyElement) {
      try {
        console.log('Privacy element dimensions:', privacyElement.offsetWidth, 'x', privacyElement.offsetHeight);
        
        const privacyCanvas = await html2canvas(privacyElement, canvasOptions);
        
        console.log('Privacy canvas dimensions:', privacyCanvas.width, 'x', privacyCanvas.height);

        if (privacyCanvas && privacyCanvas.width > 0 && privacyCanvas.height > 0) {
          const privacyImgWidth = contentWidth;
          const privacyImgHeight = (privacyCanvas.height * privacyImgWidth) / privacyCanvas.width;

          if (isFinite(privacyImgHeight) && privacyImgHeight > 0) {
            // Solo agregar nueva página si no cabe en la página actual
            if (yPosition + privacyImgHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
              console.log('Privacy notice needs new page');
            }

            const privacyImgData = privacyCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(privacyImgData, 'PNG', margin, yPosition, privacyImgWidth, privacyImgHeight);
            console.log('Privacy notice added successfully at Y position:', yPosition);
          }
        }
      } catch (privacyError) {
        console.error("Error processing privacy notice:", privacyError);
      }      
    }

    // 5. AÑADIR NÚMEROS DE PÁGINA A TODAS LAS PÁGINAS
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Configurar el estilo del texto
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      // Agregar encabezado en todas las páginas
      // const headerText = `Estudio Socioeconómico - ${props.beneficiary.name} ${props.beneficiary.fatherSurname} - Página ${i} de ${pageCount}`;
      // pdf.text(headerText, margin, margin - 3);
      // pdf.line(margin, margin - 1, pdf.internal.pageSize.width - margin, margin - 1);
      
      // Agregar pie de página con número de página
      pdf.text(
        `Estudio Socioeconómico - ${props.beneficiary.name} ${props.beneficiary.fatherSurname} - Página ${i} de ${pageCount}`,
        margin,
        pdf.internal.pageSize.height - 10,
        { align: 'left' }
      );
    }

    // 6. AGREGAR METADATOS Y GUARDAR
    pdf.setProperties({
      title: `Estudio Socioeconómico - ${props.assessment.folio}`,
      subject: 'Estudio Socioeconómico de Beneficiario DIF Municipal',
      author: 'DIF Municipal La Paz Baja California Sur.',
      keywords: 'beneficiario, estudio, socioeconómico',
      creator: 'Sistema del Padrón de Beneficiarios'
    });

    console.log('Saving PDF...');
    pdf.save(`${beneficiaryFileName.value}.pdf`);
    console.log('PDF saved successfully');

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Ocultar el elemento nuevamente
    container.classList.remove('generating');
    console.log('Cleanup complete');
  }
};

// expose
defineExpose({ generateSocioeconomicPDF });
</script>

<style scoped>
#socioeconomic-study {
  font-family: 'Arial', sans-serif !important;
  position: fixed;
  left: 0;
  top: 0;
  width: 816px;
  background: white;
  z-index: -9999;
  pointer-events: none;
  overflow: visible;
}

#socioeconomic-study.generating {
  z-index: -9999;
  top: 0;
}

.ticket-content {
  background-color: #ffffff;
  width: 816px;
  margin: 0;
  padding: 2rem;
  color: #333333;
}

/* ENCABEZADO FORMAL */
.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  min-height: 60px;
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
  font-size: 14px;
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
  min-height: 40px;
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
  min-height: 50px;
  width: 100%;
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
  min-height: 30px;
}

/* Beneficiary photo styles */
.beneficiary-header {
  display: flex;
  margin-bottom: 15px;
  gap: 20px;
  min-height: 150px;
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

/* TABLAS DE INFORMACIÓN */
.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-height: 20px;
}

.info-table td,
.info-table th {
  padding: 5px;
  vertical-align: top;
}

.info-header {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: left;
  padding: 8px 5px;
  font-size: 11px;
  border: 1px solid #ddd;
}

.info-table thead tr {
  background-color: #f0f0f0;
}

.info-table tfoot td {
  border-top: 2px solid #333;
  padding-top: 8px;
}

.info-label {
  font-weight: bold;
  width: 20%;
}

.info-value {
  width: 30%;
}

.text-right {
  text-align: right;
}

.font-bold {
  font-weight: bold;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

/* GRID CONTAINER */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  min-height: 50px;
}

.section-subtitle {
  font-size: 12px;
  margin: 0 0 10px 0;
}

/* LISTAS DE SERVICIOS Y GASTOS */
.services-list,
.expenses-list {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  min-height: 20px;
}

.services-list li,
.expenses-list li {
  font-size: 12px;
  margin: 3px 0;
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
  min-height: 150px;
}

.sign-text {
  margin: 0 0 2rem 0;
  text-align: center;
}

.text-center {
  text-align: center;
}

.signatures-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  min-height: 100px;
}

.signature-column {
  width: 45%;
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
  min-height: 120px;
}

.official-seal {
  width: 100px;
  margin-right: 20px;
  flex-shrink: 0;
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
  margin: 0;
}

.footer-text {
  flex: 1;
  font-size: 10px;
  color: #333;
}

.footer-text p {
  margin: 2px 0;
}

.document-generated {
  font-style: italic;
  color: #666;
  margin-top: 15px;
}

.document-operator {
  font-weight: bold;
}

/* Estilos para el aviso de privacidad */
.privacy-section {
  margin-top: 2rem;
}

.privacy-notice {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 8px;
  line-height: 1.4;
  text-align: left;
}

.privacy-title {
  font-size: 10px;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-align: center;
  text-transform: uppercase;
  color: #343434;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
}

.privacy-content {
  text-align: justify;
}

.privacy-content p {
  margin: 5px 0;
  line-height: 1.3;
}

.privacy-list {
  margin: 5px 0 5px 15px;
  padding: 0;
  list-style-type: disc;
}

.privacy-list li {
  margin-bottom: 3px;
  line-height: 1.2;
}

.privacy-version {
  font-style: italic;
  text-align: right;
  margin: 10px 0 5px 0;
  color: #666;
  font-size: 8px;
}

.privacy-note {
  font-size: 8px;
  color: #666;
  margin: 10px 0 0 0;
  font-style: italic;
  text-align: justify;
}

.privacy-notice strong {
  color: #2c3e50;
}

@media print {
  .btn {
    display: none;
  }
}
</style>