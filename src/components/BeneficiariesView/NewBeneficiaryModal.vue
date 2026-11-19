<template>
  <dialog ref="newBeneficiaryModalRef" class="modal" @cancel.prevent="closeModal">
    <div class="modal-box mx-3 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden p-0">
      <div class="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
        <AppModalHeader
          title="Nuevo beneficiario"
          description="Completa el expediente paso a paso. Podrás revisar toda la información antes de guardarla."
          @close="closeModal"
        >
          <template #icon><IconUserPlus class="h-5 w-5" /></template>
        </AppModalHeader>

        <section class="mb-4 border-b border-gray-200 pb-3 pt-2" aria-label="Progreso del registro">
          <ol class="grid grid-cols-4 gap-1">
            <li v-for="(step, index) in steps" :key="step.title">
              <button
                type="button"
                class="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-2 text-left transition-colors sm:justify-start"
                :class="index === currentStep
                  ? 'bg-red-50 text-red-950'
                  : index < currentStep
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'cursor-default text-gray-500'"
                :disabled="index > currentStep || loading"
                @click="goToPreviousStep(index)"
              >
                <span
                  class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold"
                  :class="index <= currentStep ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-600'"
                >
                  <IconCheck v-if="index < currentStep" class="h-4 w-4" aria-hidden="true" />
                  <span v-else>{{ index + 1 }}</span>
                </span>
                <span class="truncate text-xs font-semibold" :class="index === currentStep ? 'inline' : 'hidden sm:inline'">{{ step.title }}</span>
              </button>
            </li>
          </ol>
          <progress class="progress progress-error mt-1 h-1 w-full" :value="progress" max="100">
            {{ progress }}%
          </progress>
          <span class="sr-only">Paso {{ currentStep + 1 }} de {{ steps.length }}: {{ currentStepData.title }}</span>
        </section>
      </div>

      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="handlePrimaryAction">
        <div ref="formContentRef" class="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
          <section v-if="currentStep === 0" class="space-y-6" aria-labelledby="identity-step-title">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
                <IconId class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id="identity-step-title" class="text-lg font-bold text-gray-950">Identidad</h3>
                <p class="mt-1 text-sm text-gray-600">Captura los datos que identifican a la persona.</p>
              </div>
            </div>

            <div>
              <label for="curp" class="required block text-sm font-medium text-gray-700">CURP</label>
              <div class="mt-1 flex flex-col gap-2 sm:flex-row">
                <input
                  id="curp"
                  v-model="beneficiary.curp"
                  v-maska="'@@@@######@@@@@@**'"
                  type="text"
                  maxlength="18"
                  autocomplete="off"
                  class="input input-bordered min-h-11 w-full uppercase"
                  :class="{ 'input-error': v$.curp.$errors.length || beneficiaryExists }"
                  :disabled="loading"
                  aria-describedby="curp-help curp-errors"
                  @input="handleCurpInput"
                  @blur="checkBeneficiaryExists"
                />
                <button
                  type="button"
                  class="btn min-h-11 shrink-0 border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  :disabled="loading || generatingCurp"
                  @click="generateCurp"
                >
                  <span v-if="generatingCurp" class="loading loading-spinner loading-sm"></span>
                  <IconWand v-else class="h-4 w-4" aria-hidden="true" />
                  Generar provisional
                </button>
              </div>
              <p id="curp-help" class="mt-1 text-xs text-gray-600">Escribe los 18 caracteres o genera una CURP provisional.</p>
              <div id="curp-errors" aria-live="polite">
                <p v-for="error of v$.curp.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">
                  {{ error.$message }}
                </p>
                <p v-if="checkingCurp" class="mt-1 flex items-center gap-1 text-xs text-gray-600">
                  <span class="loading loading-spinner loading-xs"></span> Verificando CURP...
                </p>
                <p v-if="beneficiaryExists" class="mt-1 text-sm font-semibold text-red-800">
                  Este beneficiario ya existe.
                  <button type="button" class="underline" @click="goToBeneficiary">Ver expediente</button>
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label for="name" class="required block text-sm font-medium text-gray-700">Nombre(s)</label>
                <input id="name" v-model.trim="beneficiary.name" type="text" autocomplete="given-name"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.name.$errors.length }" />
                <p v-for="error of v$.name.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="fatherSurname" class="required block text-sm font-medium text-gray-700">Apellido paterno</label>
                <input id="fatherSurname" v-model.trim="beneficiary.fatherSurname" type="text" autocomplete="family-name"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.fatherSurname.$errors.length }" />
                <p v-for="error of v$.fatherSurname.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="motherSurname" class="block text-sm font-medium text-gray-700">Apellido materno</label>
                <input id="motherSurname" v-model.trim="beneficiary.motherSurname" type="text" autocomplete="additional-name"
                  class="input input-bordered mt-1 min-h-11 w-full" />
              </div>
              <div>
                <label for="birthdate" class="required block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                <input id="birthdate" v-model="beneficiary.birthdate" type="date" :max="today"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.birthdate.$errors.length }" />
                <p v-for="error of v$.birthdate.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="age" class="block text-sm font-medium text-gray-700">Edad</label>
                <input id="age" :value="beneficiary.age ?? ''" type="number" readonly
                  class="input input-bordered mt-1 min-h-11 w-full bg-gray-100 text-gray-700" />
                <p class="mt-1 text-xs text-gray-600">Se calcula automáticamente.</p>
              </div>
              <div>
                <label for="birthplace" class="block text-sm font-medium text-gray-700">Lugar de nacimiento</label>
                <input id="birthplace" v-model.trim="beneficiary.birthplace" type="text"
                  class="input input-bordered mt-1 min-h-11 w-full" />
              </div>
            </div>

            <fieldset>
              <legend class="block text-sm font-medium text-gray-700">Sexo</legend>
              <div class="mt-2 grid grid-cols-2 gap-3">
                <label v-for="option in sexOptions" :key="option.value"
                  class="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                  :class="beneficiary.sex === option.value ? 'border-red-300 bg-red-50 text-red-950' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'">
                  <input v-model="beneficiary.sex" type="radio" :value="option.value" class="radio radio-sm radio-error" />
                  <span class="text-sm font-semibold">{{ option.label }}</span>
                </label>
              </div>
            </fieldset>
          </section>

          <section v-else-if="currentStep === 1" class="space-y-6" aria-labelledby="personal-step-title">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
                <IconUserHeart class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id="personal-step-title" class="text-lg font-bold text-gray-950">Datos personales</h3>
                <p class="mt-1 text-sm text-gray-600">Información de contacto, ocupación y condiciones personales.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label for="phone" class="required block text-sm font-medium text-gray-700">Teléfono</label>
                <input id="phone" v-model="beneficiary.phone" v-maska="'(###) ### ####'" type="tel" autocomplete="tel"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.phone.$errors.length }" />
                <p v-for="error of v$.phone.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="occupation" class="required block text-sm font-medium text-gray-700">Ocupación</label>
                <input id="occupation" v-model.trim="beneficiary.occupation" type="text"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.occupation.$errors.length }" />
                <p v-for="error of v$.occupation.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div class="sm:col-span-2">
                <label for="occupationDescription" class="block text-sm font-medium text-gray-700">Descripción laboral</label>
                <input id="occupationDescription" v-model.trim="beneficiary.occupationDescription" type="text"
                  placeholder="Ej. Comercio informal, venta de alimentos"
                  class="input input-bordered mt-1 min-h-11 w-full" />
              </div>
              <div>
                <label for="medicalService" class="required block text-sm font-medium text-gray-700">Servicio médico</label>
                <select id="medicalService" v-model="beneficiary.medicalService"
                  class="select select-bordered mt-1 min-h-11 w-full" :class="{ 'select-error': v$.medicalService.$errors.length }">
                  <option disabled value="">Selecciona una opción</option>
                  <option v-for="service in medicalServices" :key="service.value" :value="service.value">{{ service.text }}</option>
                </select>
                <p v-for="error of v$.medicalService.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="civilStatus" class="required block text-sm font-medium text-gray-700">Estado civil</label>
                <select id="civilStatus" v-model="beneficiary.civilStatus"
                  class="select select-bordered mt-1 min-h-11 w-full" :class="{ 'select-error': v$.civilStatus.$errors.length }">
                  <option disabled value="">Selecciona una opción</option>
                  <option v-for="status in civilStatus" :key="status.value" :value="status.value">{{ status.text }}</option>
                </select>
                <p v-for="error of v$.civilStatus.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="scholarship" class="required block text-sm font-medium text-gray-700">Escolaridad</label>
                <select id="scholarship" v-model="beneficiary.scholarship"
                  class="select select-bordered mt-1 min-h-11 w-full" :class="{ 'select-error': v$.scholarship.$errors.length }">
                  <option disabled value="">Selecciona una opción</option>
                  <option v-for="option in scholarships" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
                <p v-for="error of v$.scholarship.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <label class="flex min-h-11 cursor-pointer items-center justify-between gap-4" for="hasDisability">
                <span>
                  <span class="block text-sm font-semibold text-gray-900">¿Tiene alguna discapacidad?</span>
                  <span class="mt-1 block text-xs text-gray-600">Activa esta opción para especificar el tipo.</span>
                </span>
                <input id="hasDisability" v-model="beneficiary.hasDisability" type="checkbox" class="toggle toggle-error" />
              </label>
              <div v-if="beneficiary.hasDisability" class="mt-4 border-t border-gray-200 pt-4">
                <label for="disabilityType" class="block text-sm font-medium text-gray-700">Tipo de discapacidad</label>
                <select id="disabilityType" v-model="beneficiary.disabilityType" class="select select-bordered mt-1 min-h-11 w-full">
                  <option disabled value="">Selecciona una opción</option>
                  <option v-for="type in disabilityTypes" :key="type.value" :value="type.value">{{ type.text }}</option>
                </select>
              </div>
            </div>
          </section>

          <section v-else-if="currentStep === 2" class="space-y-6" aria-labelledby="address-step-title">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
                <IconMapPin class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id="address-step-title" class="text-lg font-bold text-gray-950">Domicilio</h3>
                <p class="mt-1 text-sm text-gray-600">Ubica el domicilio donde reside actualmente.</p>
              </div>
            </div>

            <fieldset>
              <legend class="block text-sm font-medium text-gray-700">Tipo de comunidad</legend>
              <div class="mt-2 grid grid-cols-2 gap-3">
                <label v-for="option in communityOptions" :key="option.value"
                  class="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                  :class="beneficiary.address.communityType === option.value ? 'border-red-300 bg-red-50 text-red-950' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'">
                  <input v-model="beneficiary.address.communityType" type="radio" :value="option.value" class="radio radio-sm radio-error" />
                  <span class="text-sm font-semibold">{{ option.label }}</span>
                </label>
              </div>
            </fieldset>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label for="delegation" class="required block text-sm font-medium text-gray-700">Delegación</label>
                <select id="delegation" v-model="beneficiary.address.delegation" class="select select-bordered mt-1 min-h-11 w-full"
                  :class="{ 'select-error': v$.address.delegation.$errors.length }" @change="getSubDelegations">
                  <option disabled value="">Selecciona una delegación</option>
                  <option v-for="delegation in delegations" :key="delegation.value" :value="delegation.value">{{ delegation.text }}</option>
                </select>
                <p v-for="error of v$.address.delegation.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="subdelegation" class="required block text-sm font-medium text-gray-700">Subdelegación</label>
                <select id="subdelegation" v-model="beneficiary.address.subdelegation" class="select select-bordered mt-1 min-h-11 w-full"
                  :class="{ 'select-error': v$.address.subdelegation.$errors.length }" :disabled="!beneficiary.address.delegation">
                  <option disabled value="">Selecciona una subdelegación</option>
                  <option v-for="subdelegation in subdelegations" :key="subdelegation.value" :value="subdelegation.value">{{ subdelegation.text }}</option>
                </select>
                <p v-for="error of v$.address.subdelegation.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="street" class="required block text-sm font-medium text-gray-700">Calle</label>
                <input id="street" v-model.trim="beneficiary.address.street" type="text" autocomplete="address-line1"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.address.street.$errors.length }" />
                <p v-for="error of v$.address.street.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="sideStreets" class="block text-sm font-medium text-gray-700">Entre calles</label>
                <input id="sideStreets" v-model.trim="beneficiary.address.sideStreets" type="text"
                  class="input input-bordered mt-1 min-h-11 w-full" />
              </div>
              <div>
                <label for="extNum" class="required block text-sm font-medium text-gray-700">Número exterior</label>
                <input id="extNum" v-model.trim="beneficiary.address.extNum" type="text"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.address.extNum.$errors.length }" />
                <p v-for="error of v$.address.extNum.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="intNum" class="block text-sm font-medium text-gray-700">Número interior</label>
                <input id="intNum" v-model.trim="beneficiary.address.intNum" type="text"
                  class="input input-bordered mt-1 min-h-11 w-full" />
              </div>
              <div>
                <label for="cp" class="required block text-sm font-medium text-gray-700">Código postal</label>
                <input id="cp" v-model="beneficiary.address.cp" v-maska="'#####'" type="text" inputmode="numeric" autocomplete="postal-code"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.address.cp.$errors.length }" />
                <p v-for="error of v$.address.cp.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="neighborhood" class="required block text-sm font-medium text-gray-700">Colonia</label>
                <input id="neighborhood" v-model.trim="beneficiary.address.neighborhood" list="neighborhoods" type="text" autocomplete="address-line2"
                  class="input input-bordered mt-1 min-h-11 w-full" :class="{ 'input-error': v$.address.neighborhood.$errors.length }" />
                <datalist id="neighborhoods">
                  <option v-for="neighborhood in foundNeighborhoods" :key="neighborhood.nombre" :value="neighborhood.nombre" />
                </datalist>
                <p v-for="error of v$.address.neighborhood.$errors" :key="error.$uid" class="mt-1 text-xs font-semibold text-red-700">{{ error.$message }}</p>
              </div>
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700">Ciudad</label>
                <input id="city" v-model.trim="beneficiary.address.city" type="text" autocomplete="address-level2"
                  class="input input-bordered mt-1 min-h-11 w-full" />
              </div>
            </div>
          </section>

          <section v-else class="space-y-6" aria-labelledby="review-step-title">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
                <IconClipboardCheck class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id="review-step-title" class="text-lg font-bold text-gray-950">Revisa el expediente</h3>
                <p class="mt-1 text-sm text-gray-600">Confirma que los datos sean correctos antes de crear el beneficiario.</p>
              </div>
            </div>

            <div class="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              <div class="p-4 sm:p-5">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <h4 class="font-semibold text-gray-900">Identidad</h4>
                  <button type="button" class="btn btn-ghost btn-sm text-red-900" @click="goToPreviousStep(0)">Editar</button>
                </div>
                <dl class="grid grid-cols-1 gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
                  <div><dt class="text-gray-600">Nombre</dt><dd class="font-semibold text-gray-900">{{ fullName }}</dd></div>
                  <div><dt class="text-gray-600">CURP</dt><dd class="font-semibold text-gray-900">{{ beneficiary.curp }}</dd></div>
                  <div><dt class="text-gray-600">Nacimiento</dt><dd class="font-semibold text-gray-900">{{ beneficiary.birthdate }} · {{ beneficiary.age }} años</dd></div>
                  <div><dt class="text-gray-600">Sexo</dt><dd class="font-semibold text-gray-900">{{ optionLabel(sexOptions, beneficiary.sex) }}</dd></div>
                </dl>
              </div>

              <div class="p-4 sm:p-5">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <h4 class="font-semibold text-gray-900">Datos personales</h4>
                  <button type="button" class="btn btn-ghost btn-sm text-red-900" @click="goToPreviousStep(1)">Editar</button>
                </div>
                <dl class="grid grid-cols-1 gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
                  <div><dt class="text-gray-600">Teléfono</dt><dd class="font-semibold text-gray-900">{{ beneficiary.phone }}</dd></div>
                  <div><dt class="text-gray-600">Ocupación</dt><dd class="font-semibold text-gray-900">{{ beneficiary.occupation }}</dd></div>
                  <div><dt class="text-gray-600">Servicio médico</dt><dd class="font-semibold text-gray-900">{{ optionLabel(medicalServices, beneficiary.medicalService) }}</dd></div>
                  <div><dt class="text-gray-600">Escolaridad</dt><dd class="font-semibold text-gray-900">{{ optionLabel(scholarships, beneficiary.scholarship) }}</dd></div>
                </dl>
              </div>

              <div class="p-4 sm:p-5">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <h4 class="font-semibold text-gray-900">Domicilio</h4>
                  <button type="button" class="btn btn-ghost btn-sm text-red-900" @click="goToPreviousStep(2)">Editar</button>
                </div>
                <p class="text-sm font-semibold leading-6 text-gray-900">{{ formattedAddress }}</p>
                <p class="mt-1 text-sm text-gray-600">{{ delegationLabel }} · {{ beneficiary.address.subdelegation }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
              <IconInfoCircle class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p class="text-sm leading-6">Después de crear el registro podrás agregar familiares, vivienda, situación económica y documentos desde el expediente.</p>
            </div>
          </section>
        </div>

        <footer class="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
          <button v-if="currentStep === 0" type="button" class="btn btn-ghost min-h-11" :disabled="loading" @click="closeModal">
            Cancelar
          </button>
          <button v-else type="button" class="btn btn-ghost min-h-11" :disabled="loading" @click="previousStep">
            <IconArrowLeft class="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>

          <button type="submit" class="btn btn-brand min-h-11 min-w-36" :disabled="loading || checkingCurp || beneficiaryExists">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <template v-else-if="currentStep < steps.length - 1">
              Continuar
              <IconArrowRight class="h-4 w-4" aria-hidden="true" />
            </template>
            <template v-else>
              <IconUserCheck class="h-4 w-4" aria-hidden="true" />
              Crear beneficiario
            </template>
          </button>
        </footer>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button type="button" aria-label="Cerrar registro" @click="closeModal">Cerrar</button>
    </form>
  </dialog>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClipboardCheck,
  IconId,
  IconInfoCircle,
  IconMapPin,
  IconUserCheck,
  IconUserHeart,
  IconUserPlus,
  IconWand,
} from '@tabler/icons-vue'
import AppModalHeader from '@/components/ui/AppModalHeader.vue'
import beneficiaryServices from '../../services/beneficiaryServices'
import { normalizeObjectTextProperties } from '../../utils/normalizeObjectText'
import { getTranslatedError } from '../../utils/errorManager'
import disabilityTypes from '../../constants/disabilityTypes'
import medicalServices from '../../constants/medicalServices'
import civilStatus from '../../constants/civilStatus'
import scholarships from '../../constants/scholarships'
import delegations from '../../constants/delegations'
import neighborhoods from '../../constants/neighborhoods'
import calculateAge from '../../utils/calcBirthdate'
import { useAuth } from '../../composables/useAuth'
import router from '../../router'

const props = defineProps({
  showModal: Boolean,
  defaultCurp: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close:modal', 'refresh:beneficiaries'])

const createInitialBeneficiary = () => ({
  name: '',
  fatherSurname: '',
  motherSurname: '',
  age: null,
  birthdate: '',
  birthplace: '',
  sex: 'HOMBRE',
  curp: '',
  phone: '',
  hasDisability: false,
  disabilityType: '',
  medicalService: '',
  civilStatus: '',
  scholarship: '',
  occupation: '',
  occupationDescription: '',
  address: {
    communityType: 'URBANA',
    delegation: '',
    subdelegation: '',
    street: '',
    sideStreets: '',
    extNum: '',
    intNum: '',
    neighborhood: '',
    cp: '',
    city: 'La Paz',
  },
})

const steps = [
  { title: 'Identidad', description: 'Datos de identificación' },
  { title: 'Datos personales', description: 'Contacto y condiciones personales' },
  { title: 'Domicilio', description: 'Ubicación de residencia' },
  { title: 'Revisión', description: 'Confirma la información' },
]

const sexOptions = [
  { label: 'Hombre', value: 'HOMBRE' },
  { label: 'Mujer', value: 'MUJER' },
]

const communityOptions = [
  { label: 'Urbana', value: 'URBANA' },
  { label: 'Rural', value: 'RURAL' },
]

const newBeneficiaryModalRef = ref()
const formContentRef = ref()
const beneficiary = reactive(createInitialBeneficiary())
const beneficiaryFound = ref(null)
const beneficiaryExists = ref(false)
const checkingCurp = ref(false)
const generatingCurp = ref(false)
const loading = ref(false)
const currentStep = ref(0)
const lastCheckedCurp = ref('')
const subdelegations = ref([])
const today = new Date().toISOString().split('T')[0]
const { authHeader } = useAuth()

const curpFormat = helpers.regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/)
const rules = {
  name: { required: helpers.withMessage('El nombre es obligatorio', required) },
  fatherSurname: { required: helpers.withMessage('El apellido paterno es obligatorio', required) },
  birthdate: { required: helpers.withMessage('La fecha de nacimiento es obligatoria', required) },
  curp: {
    format: helpers.withMessage('El formato de la CURP no es válido', curpFormat),
    required: helpers.withMessage('La CURP es obligatoria', required),
  },
  phone: { required: helpers.withMessage('El teléfono es obligatorio', required) },
  medicalService: { required: helpers.withMessage('Selecciona un servicio médico', required) },
  civilStatus: { required: helpers.withMessage('Selecciona el estado civil', required) },
  scholarship: { required: helpers.withMessage('Selecciona la escolaridad', required) },
  occupation: { required: helpers.withMessage('La ocupación es obligatoria', required) },
  address: {
    delegation: { required: helpers.withMessage('Selecciona una delegación', required) },
    subdelegation: { required: helpers.withMessage('Selecciona una subdelegación', required) },
    street: { required: helpers.withMessage('La calle es obligatoria', required) },
    extNum: { required: helpers.withMessage('El número exterior es obligatorio', required) },
    neighborhood: { required: helpers.withMessage('La colonia es obligatoria', required) },
    cp: { required: helpers.withMessage('El código postal es obligatorio', required) },
  },
}
const v$ = useVuelidate(rules, beneficiary)

const currentStepData = computed(() => steps[currentStep.value])
const progress = computed(() => Math.round(((currentStep.value + 1) / steps.length) * 100))
const fullName = computed(() => [beneficiary.name, beneficiary.fatherSurname, beneficiary.motherSurname].filter(Boolean).join(' '))
const foundNeighborhoods = computed(() => neighborhoods.filter((item) => String(item.cp) === String(beneficiary.address.cp)))
const delegationLabel = computed(() => delegations.find((item) => item.value === beneficiary.address.delegation)?.text || beneficiary.address.delegation)
const formattedAddress = computed(() => [
  beneficiary.address.street,
  beneficiary.address.extNum && `#${beneficiary.address.extNum}`,
  beneficiary.address.intNum && `Int. ${beneficiary.address.intNum}`,
  beneficiary.address.neighborhood,
  beneficiary.address.cp && `C.P. ${beneficiary.address.cp}`,
  beneficiary.address.city,
].filter(Boolean).join(', '))

watch(() => props.showModal, async (show) => {
  if (show) {
    resetForm()
    beneficiary.curp = props.defaultCurp?.toUpperCase() || ''
    await nextTick()
    newBeneficiaryModalRef.value?.showModal()
  } else {
    newBeneficiaryModalRef.value?.close()
  }
})

watch(() => props.defaultCurp, (value) => {
  if (props.showModal && value) beneficiary.curp = value.toUpperCase()
})

watch(() => beneficiary.birthdate, (value) => {
  beneficiary.age = value ? calculateAge(value) : null
})

watch(() => beneficiary.hasDisability, (value) => {
  if (!value) beneficiary.disabilityType = ''
})

const optionLabel = (options, value) => options.find((option) => option.value === value)?.text
  || options.find((option) => option.value === value)?.label
  || value

const resetForm = () => {
  Object.assign(beneficiary, createInitialBeneficiary())
  currentStep.value = 0
  beneficiaryFound.value = null
  beneficiaryExists.value = false
  lastCheckedCurp.value = ''
  subdelegations.value = []
  v$.value.$reset()
}

const scrollToTop = () => {
  nextTick(() => formContentRef.value?.scrollTo({ top: 0, behavior: 'smooth' }))
}

const handleCurpInput = () => {
  beneficiary.curp = beneficiary.curp.toUpperCase()
  beneficiaryFound.value = null
  beneficiaryExists.value = false
  lastCheckedCurp.value = ''
}

const checkBeneficiaryExists = async () => {
  if (beneficiary.curp.length !== 18 || lastCheckedCurp.value === beneficiary.curp) return beneficiaryExists.value
  checkingCurp.value = true
  try {
    const response = await beneficiaryServices.checkBeneficiaryExistsByCurp(beneficiary.curp, authHeader.value)
    beneficiaryFound.value = response.data || null
    beneficiaryExists.value = Boolean(response.data)
    lastCheckedCurp.value = beneficiary.curp
    return beneficiaryExists.value
  } catch (err) {
    toast.error(getTranslatedError(err))
    return false
  } finally {
    checkingCurp.value = false
  }
}

const generateCurp = async () => {
  generatingCurp.value = true
  try {
    const response = await beneficiaryServices.generateProvisionalCurp(authHeader.value)
    beneficiary.curp = response.data
    beneficiaryExists.value = false
    lastCheckedCurp.value = ''
    v$.value.curp.$reset()
  } catch (err) {
    toast.error(getTranslatedError(err))
  } finally {
    generatingCurp.value = false
  }
}

const getSubDelegations = () => {
  const delegation = delegations.find((item) => item.value === beneficiary.address.delegation)
  subdelegations.value = delegation?.subdelegations || []
  beneficiary.address.subdelegation = ''
}

const validateFields = async (fields) => {
  const results = await Promise.all(fields.map((field) => field.$validate()))
  return results.every(Boolean)
}

const validateCurrentStep = async () => {
  if (currentStep.value === 0) {
    const valid = await validateFields([v$.value.curp, v$.value.name, v$.value.fatherSurname, v$.value.birthdate])
    if (!valid) return false
    if (await checkBeneficiaryExists()) {
      toast.error('La CURP ya pertenece a un beneficiario registrado')
      return false
    }
    return true
  }

  if (currentStep.value === 1) {
    return validateFields([
      v$.value.phone,
      v$.value.occupation,
      v$.value.medicalService,
      v$.value.civilStatus,
      v$.value.scholarship,
    ])
  }

  if (currentStep.value === 2) {
    return validateFields([
      v$.value.address.delegation,
      v$.value.address.subdelegation,
      v$.value.address.street,
      v$.value.address.extNum,
      v$.value.address.neighborhood,
      v$.value.address.cp,
    ])
  }

  return v$.value.$validate()
}

const nextStep = async () => {
  const valid = await validateCurrentStep()
  if (!valid) {
    toast.error('Completa los campos señalados para continuar')
    return
  }
  currentStep.value += 1
  scrollToTop()
}

const previousStep = () => {
  currentStep.value = Math.max(0, currentStep.value - 1)
  scrollToTop()
}

const goToPreviousStep = (step) => {
  if (step > currentStep.value || loading.value) return
  currentStep.value = step
  scrollToTop()
}

const handlePrimaryAction = () => {
  if (currentStep.value < steps.length - 1) nextStep()
  else submitForm()
}

const submitForm = async () => {
  const isValid = await validateCurrentStep()
  if (!isValid || beneficiaryExists.value) {
    toast.error('Revisa la información antes de crear el beneficiario')
    return
  }

  loading.value = true
  try {
    const payload = normalizeObjectTextProperties(JSON.parse(JSON.stringify(beneficiary)))
    await beneficiaryServices.createBeneficiary(payload, authHeader.value)
    toast.success('Beneficiario creado correctamente')
    emit('refresh:beneficiaries')
    closeModal()
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data?.errors?.[0]?.code === 'ERR0007') {
      toast.error('La CURP ya se encuentra registrada')
    } else {
      toast.error(getTranslatedError(err))
    }
  } finally {
    loading.value = false
  }
}

const goToBeneficiary = () => {
  if (!beneficiaryFound.value?._id) return
  closeModal()
  router.push(`/beneficiaries/${beneficiaryFound.value._id}`)
}

const closeModal = () => {
  newBeneficiaryModalRef.value?.close()
  emit('close:modal')
}
</script>
