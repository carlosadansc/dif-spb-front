<template>
  <main class="app-page max-w-xl">
    <router-link to="/beneficiaries" class="btn btn-ghost btn-sm -ml-3 mb-3">
      <IconArrowLeft class="h-4 w-4" /> Beneficiarios
    </router-link>
    <AppPageHeader title="Registro rápido con INE" description="Captura los datos básicos del beneficiario desde la cámara del teléfono.">
      <template #icon><IconId class="h-6 w-6" /></template>
    </AppPageHeader>

    <section v-if="!previewUrl && !cameraOpen" class="rounded-2xl border-2 border-dashed border-red-200 bg-white p-6 text-center shadow-sm">
      <div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-800">
        <IconId class="h-8 w-8" />
      </div>
      <h2 class="font-semibold text-gray-900">Escanea el frente de la INE</h2>
      <p class="mx-auto mt-1 max-w-sm text-sm text-gray-600">Colócala completa, sin reflejos y con buena iluminación.</p>
      <button class="btn mt-5 min-h-12 w-full bg-red-800 text-white hover:bg-red-900" type="button"
        :disabled="startingCamera" @click="startCamera">
        <span v-if="startingCamera" class="loading loading-spinner loading-sm"></span>
        <IconCamera v-else class="h-5 w-5" />
        {{ startingCamera ? 'Abriendo cámara…' : 'Abrir cámara' }}
      </button>
      <p v-if="cameraError" class="mt-3 text-sm font-medium text-red-800" role="alert">{{ cameraError }}</p>
      <label v-if="cameraError" class="btn btn-ghost mt-2 min-h-11 w-full">
        Abrir cámara del dispositivo
        <input class="sr-only" type="file" accept="image/*" capture="environment" @change="selectImage" />
      </label>
    </section>

    <section v-if="cameraOpen" class="overflow-hidden rounded-2xl bg-gray-950 shadow-sm">
      <video ref="videoRef" class="aspect-[3/4] max-h-[72vh] w-full object-cover sm:aspect-[4/3]" autoplay muted
        playsinline aria-label="Vista de la cámara trasera"></video>
      <canvas ref="canvasRef" class="hidden"></canvas>
      <div class="grid grid-cols-2 gap-3 p-4">
        <button class="btn min-h-12 border-gray-600 bg-gray-800 text-white hover:bg-gray-700" type="button"
          @click="stopCamera">Cancelar</button>
        <button class="btn min-h-12 bg-red-800 text-white hover:bg-red-900" type="button" @click="capturePhoto">
          <IconCamera class="h-5 w-5" /> Capturar INE
        </button>
      </div>
    </section>

    <section v-else-if="previewUrl" class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img :src="previewUrl" alt="Vista previa del frente de la INE" class="aspect-[1.58/1] w-full bg-gray-100 object-contain" />
      <div v-if="scanning" class="p-5" aria-live="polite">
        <div class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
          <span>Leyendo datos…</span><span>{{ progress }}%</span>
        </div>
        <progress class="progress progress-error w-full" :value="progress" max="100"></progress>
        <p class="mt-2 text-xs text-gray-500">La primera lectura puede tardar unos segundos.</p>
      </div>
      <div v-else-if="!scanned" class="p-4">
        <p v-if="scanError" class="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-900"
          role="alert">{{ scanError }}</p>
        <div class="flex gap-3">
          <button class="btn flex-1" type="button" @click="resetImage">Cambiar foto</button>
          <button class="btn flex-1 bg-red-800 text-white hover:bg-red-900" type="button" @click="processImage">
            Leer INE
          </button>
        </div>
      </div>
    </section>

    <form v-if="scanned" class="mt-5 space-y-4" @submit.prevent="saveBeneficiary">
      <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
        <p>Revisa los datos detectados antes de crear el perfil.</p>
        <ul v-if="scanWarnings.length" class="mt-2 list-disc space-y-1 pl-5">
          <li v-for="warning in scanWarnings" :key="warning">{{ warning }}</li>
        </ul>
      </div>

      <div>
        <label class="mb-1 block text-sm font-semibold" for="curp">CURP *</label>
        <input id="curp" v-model.trim="form.curp" maxlength="18" autocomplete="off" class="input input-bordered w-full uppercase" required />
      </div>

      <div>
        <label class="mb-1 block text-sm font-semibold" for="name">Nombre(s) *</label>
        <input id="name" v-model.trim="form.name" autocomplete="given-name" class="input input-bordered w-full uppercase" required />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-semibold" for="fatherSurname">Apellido paterno *</label>
          <input id="fatherSurname" v-model.trim="form.fatherSurname" autocomplete="family-name" class="input input-bordered w-full uppercase" required />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold" for="motherSurname">Apellido materno</label>
          <input id="motherSurname" v-model.trim="form.motherSurname" class="input input-bordered w-full uppercase" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-semibold" for="birthdate">Fecha de nacimiento *</label>
          <input id="birthdate" v-model="form.birthdate" type="date" class="input input-bordered w-full" required />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold" for="sex">Sexo *</label>
          <select id="sex" v-model="form.sex" class="select select-bordered w-full" required>
            <option disabled value="">Selecciona</option>
            <option value="HOMBRE">Hombre</option>
            <option value="MUJER">Mujer</option>
          </select>
        </div>
      </div>

      <section class="space-y-4 border-t border-gray-200 pt-5" aria-labelledby="address-heading">
        <div>
          <h2 id="address-heading" class="flex items-center gap-2 text-base font-semibold text-gray-900">
            <IconMapPin class="h-5 w-5 text-red-800" /> Domicilio detectado
          </h2>
          <p class="mt-1 text-sm text-gray-600">Confirma estos datos antes de crear el perfil.</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
          <div>
            <label class="mb-1 block text-sm font-semibold" for="street">Calle</label>
            <input id="street" v-model.trim="form.address.street" autocomplete="address-line1"
              class="input input-bordered w-full uppercase" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold" for="extNum">Número</label>
            <input id="extNum" v-model.trim="form.address.extNum" autocomplete="off"
              class="input input-bordered w-full uppercase" />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold" for="neighborhood">Colonia</label>
          <input id="neighborhood" v-model.trim="form.address.neighborhood" autocomplete="address-line2"
            class="input input-bordered w-full uppercase" />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <div>
            <label class="mb-1 block text-sm font-semibold" for="cp">Código postal</label>
            <input id="cp" v-model.trim="form.address.cp" maxlength="5" inputmode="numeric" autocomplete="postal-code"
              class="input input-bordered w-full" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold" for="city">Ciudad o municipio</label>
            <input id="city" v-model.trim="form.address.city" autocomplete="address-level2"
              class="input input-bordered w-full uppercase" />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold" for="state">Estado</label>
          <input id="state" v-model.trim="form.address.state" autocomplete="address-level1"
            class="input input-bordered w-full uppercase" />
        </div>
      </section>

      <button class="btn min-h-12 w-full bg-red-800 text-white hover:bg-red-900" type="submit" :disabled="saving || !validForm">
        <span v-if="saving" class="loading loading-spinner loading-sm"></span>
        {{ saving ? 'Creando perfil…' : 'Crear perfil mínimo' }}
      </button>
      <button class="btn btn-ghost w-full" type="button" @click="resetImage">Escanear otra INE</button>
    </form>

    <section v-if="createdBeneficiary" class="mt-5 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
      <IconCircleCheck class="mx-auto h-12 w-12 text-green-700" />
      <h2 class="mt-3 text-lg font-bold text-green-950">Perfil creado</h2>
      <p class="mt-1 text-sm text-green-900">El trámite puede completarse después desde la versión de escritorio.</p>
      <dl class="mt-4 rounded-xl bg-white/70 p-4 text-left text-sm text-green-950">
        <div class="flex justify-between gap-3"><dt>Beneficiario</dt><dd class="text-right font-bold">{{ createdBeneficiary.name }} {{ createdBeneficiary.fatherSurname }}</dd></div>
        <div class="mt-2 flex justify-between gap-3"><dt>CURP</dt><dd class="font-mono font-bold">{{ createdBeneficiary.curp }}</dd></div>
        <div class="mt-2 flex justify-between gap-3"><dt>Estado</dt><dd class="font-bold">Pendiente de completar</dd></div>
      </dl>
      <div class="mt-5 grid gap-2 sm:grid-cols-2">
        <button class="btn min-h-11 bg-green-800 text-white hover:bg-green-900" type="button" @click="startAnother">Registrar otra persona</button>
        <router-link :to="`/beneficiaries/${createdBeneficiary._id}`" class="btn min-h-11 border-green-700 bg-white text-green-900">Ver expediente</router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'
import { IconArrowLeft, IconCamera, IconCircleCheck, IconId, IconMapPin } from '@tabler/icons-vue'
import AppPageHeader from '@/components/ui/AppPageHeader.vue'
import { toast } from 'vue3-toastify'
import beneficiaryServices from '../services/beneficiaryServices'
import { useAuth } from '../composables/useAuth'

const { authHeader } = useAuth()
const imageFile = ref(null)
const previewUrl = ref('')
const scanning = ref(false)
const scanned = ref(false)
const saving = ref(false)
const progress = ref(0)
const createdBeneficiary = ref(null)
const scanError = ref('')
const scanWarnings = ref([])
const cameraOpen = ref(false)
const startingCamera = ref(false)
const cameraError = ref('')
const cameraStream = ref(null)
const videoRef = ref(null)
const canvasRef = ref(null)

const emptyAddress = () => ({ street: '', extNum: '', neighborhood: '', cp: '', city: '', state: '' })
const form = reactive({ name: '', fatherSurname: '', motherSurname: '', curp: '', birthdate: '', sex: '', address: emptyAddress() })
const validForm = computed(() => /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(form.curp.toUpperCase())
  && form.name && form.fatherSurname && form.birthdate && form.sex)

const clearPreview = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

const useImageFile = (file) => {
  if (!file.type.startsWith('image/') || file.size > 15 * 1024 * 1024) {
    toast.error('Usa una imagen válida de máximo 15 MB')
    return false
  }
  imageFile.value = file
  clearPreview()
  previewUrl.value = URL.createObjectURL(file)
  scanned.value = false
  scanError.value = ''
  return true
}

const selectImage = (event) => {
  const [file] = event.target.files || []
  if (file) useImageFile(file)
  event.target.value = ''
}

const stopCamera = () => {
  cameraStream.value?.getTracks().forEach((track) => track.stop())
  cameraStream.value = null
  if (videoRef.value) videoRef.value.srcObject = null
  cameraOpen.value = false
}

const startCamera = async () => {
  cameraError.value = ''
  startingCamera.value = true
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('UNSUPPORTED_CAMERA')
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    })
    cameraStream.value = stream
    cameraOpen.value = true
    await nextTick()
    videoRef.value.srcObject = stream
    await videoRef.value.play()
  } catch (error) {
    console.error(error)
    stopCamera()
    cameraError.value = error.name === 'NotAllowedError'
      ? 'Permite el acceso a la cámara desde la configuración del navegador.'
      : 'No fue posible abrir la cámara. Verifica que el sitio use HTTPS.'
  } finally {
    startingCamera.value = false
  }
}

const capturePhoto = () => {
  const video = videoRef.value
  const canvas = canvasRef.value
  if (!video?.videoWidth || !canvas) {
    toast.error('La cámara aún no está lista')
    return
  }
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  canvas.toBlob((blob) => {
    if (!blob) {
      toast.error('No fue posible capturar la imagen')
      return
    }
    const file = new File([blob], `ine-${Date.now()}.jpg`, { type: 'image/jpeg' })
    if (useImageFile(file)) stopCamera()
  }, 'image/jpeg', 0.92)
}

const processImage = async () => {
  scanning.value = true
  progress.value = 8
  scanError.value = ''
  scanWarnings.value = []
  const progressTimer = window.setInterval(() => {
    progress.value = Math.min(90, progress.value + 3)
  }, 500)
  try {
    const response = await beneficiaryServices.scanBeneficiaryIne(imageFile.value, authHeader.value)
    const result = response.data
    progress.value = 100
    Object.assign(form, result.fields)
    form.curp = form.curp.toUpperCase()
    scanWarnings.value = result.quality?.warnings || []
    const detectedFields = result.detectedFields || 0
    if (detectedFields === 0) {
      scanError.value = 'No se detectaron datos. Toma otra foto más cerca, sin movimiento, reflejos ni sombras.'
      toast.error('No fue posible leer la INE')
      return
    }
    scanned.value = true
    if (!validForm.value) toast.info('Completa los campos que no pudieron leerse con claridad')
  } catch (error) {
    console.error(error)
    const code = error.response?.data?.errors?.[0]?.code
    scanError.value = code === 'OCR_UNAVAILABLE'
      ? 'El lector de INE no está disponible en el servidor.'
      : code === 'OCR_TIMEOUT'
        ? 'La lectura tardó demasiado. Intenta nuevamente.'
        : 'No fue posible leer la INE. Intenta con otra foto.'
    toast.error(scanError.value)
  } finally {
    window.clearInterval(progressTimer)
    scanning.value = false
  }
}

const saveBeneficiary = async () => {
  if (!validForm.value) return
  saving.value = true
  try {
    const payload = {
      ...form,
      name: form.name.toUpperCase(),
      fatherSurname: form.fatherSurname.toUpperCase(),
      motherSurname: form.motherSurname.toUpperCase(),
      curp: form.curp.toUpperCase(),
      address: Object.fromEntries(Object.entries(form.address)
        .map(([field, value]) => [field, typeof value === 'string' ? value.trim().toUpperCase() : value])
        .filter(([, value]) => value !== '')),
    }
    const response = await beneficiaryServices.createBeneficiaryFromIne(payload, authHeader.value)
    createdBeneficiary.value = response.data.beneficiary
    scanned.value = false
    clearPreview()
  } catch (error) {
    const duplicate = error.response?.data?.errors?.some(({ code }) => code === 'ERR0007')
    toast.error(duplicate ? 'La CURP ya está registrada' : 'No fue posible crear el perfil')
  } finally {
    saving.value = false
  }
}

const resetForm = () => Object.assign(form, { name: '', fatherSurname: '', motherSurname: '', curp: '', birthdate: '', sex: '', address: emptyAddress() })
const resetImage = () => { clearPreview(); imageFile.value = null; scanned.value = false; scanError.value = ''; scanWarnings.value = []; resetForm() }
const startAnother = () => { createdBeneficiary.value = null; resetImage() }

onBeforeUnmount(() => {
  stopCamera()
  clearPreview()
})
</script>
