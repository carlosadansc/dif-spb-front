<template>
  <div class="app-page max-w-7xl">
    <div>

      <div v-if="loading" class="space-y-4 pt-4" aria-label="Cargando expediente">
        <div class="skeleton h-14 w-2/3 max-w-xl"></div>
        <div class="skeleton h-12 w-full"></div>
        <div class="skeleton h-72 w-full"></div>
      </div>

      <AppPageHeader v-if="!loading" :title="beneficiaryFullName"
        :description="beneficiary.curp ? `CURP: ${beneficiary.curp}` : 'Expediente del beneficiario'">
        <template #icon><IconUserCircle class="h-6 w-6" /></template>
        <button class="btn min-h-11 btn-ghost" aria-label="Volver a beneficiarios" @click="goBack">
          <IconArrowNarrowLeft class="h-5 w-5" /> <span class="hidden sm:inline">Volver</span>
        </button>
          <div class="tooltip tooltip-bottom" data-tip="Cancelar">
            <button v-if="isEditing" class="btn min-h-11 bg-gray-200 text-gray-900"
              aria-label="Cancelar edición" @click="isEditing = false">
              <IconCancel class="h-5 w-5 text-red-800" />
              <span class="hidden sm:inline">Cancelar</span>
            </button>
          </div>
          <div class="tooltip tooltip-bottom"
            :data-tip="!isEditing ? 'Editar información del beneficiario' : 'Guardar cambios'">
            <button @click.prevent="toggleEditMode" id="edit-save"
              :aria-label="isEditing ? 'Guardar cambios' : 'Editar expediente'"
              class="btn min-h-11 bg-red-800 font-bold text-white hover:bg-red-900"><span v-if="loadingSave"
                 class="loading loading-spinner"></span>
              <IconEdit v-if="!isEditing && !loadingSave" class="h-5 w-5" />
              <IconDeviceFloppy v-if="isEditing && !loadingSave" class="h-5 w-5" />
              <span class="hidden sm:inline">{{ isEditing ? 'Guardar cambios' : 'Editar expediente' }}</span>
            </button>
          </div>
      </AppPageHeader>

      <CompletionBanner v-if="!loading" class="mt-5" :beneficiary="beneficiary" @start="startCompletion" />


      <!-- Navigation Tabs -->
      <div v-if="!loading" class="mt-4">
        <nav class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm" aria-label="Secciones del expediente" role="tablist">
          <div v-for="section in sections" :key="section.id" class="shrink-0">
            <button
              role="tab" :aria-selected="activeSection === section.id"
              class="btn min-h-11 whitespace-nowrap border-0 px-3 text-sm"
              :class="activeSection === section.id ? 'bg-red-900 text-white hover:bg-red-950' : 'btn-ghost text-gray-700 hover:bg-red-50 hover:text-red-900'"
              @click="activeSection = section.id">
              <component :is="section.icon" class="h-4 w-4" aria-hidden="true" />
              {{ section.title }}
              <span v-if="pendingFieldCountBySection[section.id]"
                class="badge h-5 min-w-5 border-amber-300 bg-amber-100 px-1.5 text-xs font-bold text-amber-900"
                :aria-label="`${pendingFieldCountBySection[section.id]} campos pendientes`">
                {{ pendingFieldCountBySection[section.id] }}
              </span>
            </button>
          </div>
        </nav>
      </div>

      <!-- Content Sections -->
      <div v-if="!loading" class="surface-panel mt-4 p-4 sm:p-6">
        <!-- General Information -->
        <div v-if="activeSection === 'general'" class="space-t-6">
          <PhotoPicker class="mb-6" :beneficiaryId="beneficiaryId" :defaultPhoto="photoUrl"
            :storedPhotoPath="beneficiary.photo"
            @photo-selected="beneficiary.photo = $event" />

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">CURP</label>
              <input :disabled="!isEditing" v-maska="'@@@@######@@@@@@**'" type="text" v-model="beneficiary.curp"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.name"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Paterno</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.fatherSurname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Materno</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.motherSurname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad</label>
              <input :disabled="!isEditing" type="number" v-model.number="beneficiary.age" min="0" max="120" @input="(e) => {
                // Ensure the value is a valid number between 0 and 120
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) e.target.value = 0;
                if (value > 120) e.target.value = 120;
              }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input :disabled="!isEditing" type="date" v-model="birthdateInput"
                :max="new Date().toISOString().split('T')[0]"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              <p v-if="formattedBirthdate" class="text-xs text-gray-500 mt-1">{{ formattedBirthdate }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lugar de Nacimiento</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.birthplace"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Sexo</label>
              <select :disabled="!isEditing" v-model="beneficiary.sex"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </select>
            </div>
            <div>
              <label for="beneficiary-phone" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Teléfono <PendingFieldMarker :show="isFieldPending('phone')" />
              </label>
              <input id="beneficiary-phone" :disabled="!isEditing" v-maska="'(###) ### ####'" type="tel" v-model="beneficiary.phone"
                :class="{ 'pending-profile-field': isFieldPending('phone') }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="beneficiary-civil-status" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Estado civil <PendingFieldMarker :show="isFieldPending('civilStatus')" />
              </label>
              <select id="beneficiary-civil-status" :disabled="!isEditing" v-model="beneficiary.civilStatus"
                :class="{ 'pending-profile-field': isFieldPending('civilStatus') }"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CASADO">Casado</option>
                <option value="SOLTERO">Soltero</option>
                <option value="VIUDO">Viudo</option>
                <option value="UNION_LIBRE">Unión Libre</option>
              </select>
            </div>
            <div>
              <label for="beneficiary-scholarship" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Escolaridad <PendingFieldMarker :show="isFieldPending('scholarship')" />
              </label>
              <select id="beneficiary-scholarship" :disabled="!isEditing" v-model="beneficiary.scholarship"
                :class="{ 'pending-profile-field': isFieldPending('scholarship') }"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="scholarship in scholarships" :key="scholarship.id" :value="scholarship.value">
                  {{ scholarship.text }}
                </option>
              </select>
            </div>

            <div>
              <label for="beneficiary-medical-service" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Servicio médico <PendingFieldMarker :show="isFieldPending('medicalService')" />
              </label>
              <select id="beneficiary-medical-service" :disabled="!isEditing" v-model="beneficiary.medicalService"
                :class="{ 'pending-profile-field': isFieldPending('medicalService') }"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="medicalService in medicalServices" :key="medicalService.id"
                  :value="medicalService.value">
                  {{ medicalService.text }}
                </option>
              </select>
            </div>

            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.hasDisability"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">¿Tiene alguna discapacidad?</label>
            </div>

            <div v-if="beneficiary.hasDisability">
              <label class="block text-sm font-medium text-gray-700">Tipo de Discapacidad</label>
              <select :disabled="!isEditing" v-model="beneficiary.disabilityType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="disabilityType in disabilityTypes" :key="disabilityType.id"
                  :value="disabilityType.value">
                  {{ disabilityType.text }}
                </option>
              </select>
            </div>

            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.isIndigenousCommunity"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">¿Pertenece a una comunidad indígena?</label>
            </div>
            <div v-if="beneficiary.isIndigenousCommunity">
              <label class="block text-sm font-medium text-gray-700">Especifique la comunidad indígena</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.indigenousCommunity"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.isLgbtq"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">¿Pertenece a la comunidad LGBTQ+?</label>
            </div>
            <div v-if="beneficiary.isLgbtq">
              <label class="block text-sm font-medium text-gray-700">Orientación sexual</label>
              <select :disabled="!isEditing" v-model="beneficiary.sexualOrientation"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="HETEROSEXUAL">Heterosexual</option>
                <option value="HOMOSEXUAL">Homosexual</option>
                <option value="BISEXUAL">Bisexual</option>
                <option value="PANSEXUAL">Pansexual</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          <div class="mt-5">
            <label class="block text-sm font-medium text-gray-700">Comentarios / Observaciones</label>
            <textarea :disabled="!isEditing" v-model="beneficiary.comments"
              class="textarea h-24 mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>

        <!-- Address -->
        <div v-if="activeSection === 'address'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Comunidad</label>
              <select :disabled="!isEditing" v-model="beneficiary.address.communityType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="RURAL">Rural</option>
                <option value="URBANA">Urbana</option>
              </select>
            </div>
            <div>
              <label for="beneficiary-delegation" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Delegación <PendingFieldMarker :show="isFieldPending('delegation')" />
              </label>
              <select id="beneficiary-delegation" :disabled="!isEditing" name="delegation" v-model="beneficiary.address.delegation"
                @change="getSubdelegations()"
                :class="{ 'pending-profile-field': isFieldPending('delegation') }"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="delegation in delegations" :key="delegation.id" :value="delegation.value">
                  {{ delegation.text }}
                </option>
              </select>
            </div>
            <div>
              <label for="beneficiary-subdelegation" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Subdelegación <PendingFieldMarker :show="isFieldPending('subdelegation')" />
              </label>
              <select id="beneficiary-subdelegation" :disabled="!isEditing" name="subdelegation" v-model="beneficiary.address.subdelegation"
                :class="{ 'pending-profile-field': isFieldPending('subdelegation') }"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="subdelegation in subdelegations" :key="subdelegation.text" :value="subdelegation.value">
                  {{ subdelegation.text }}
                </option>
              </select>
            </div>
            <div>
              <label for="beneficiary-street" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Calle <PendingFieldMarker :show="isFieldPending('street')" />
              </label>
              <input id="beneficiary-street" :disabled="!isEditing" type="text" v-model="beneficiary.address.street"
                :class="{ 'pending-profile-field': isFieldPending('street') }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Calles Laterales</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.sideStreets"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="beneficiary-ext-num" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Número exterior <PendingFieldMarker :show="isFieldPending('extNum')" />
              </label>
              <input id="beneficiary-ext-num" :disabled="!isEditing" type="text" v-model="beneficiary.address.extNum"
                :class="{ 'pending-profile-field': isFieldPending('extNum') }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Interior</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.intNum"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="beneficiary-neighborhood" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Colonia <PendingFieldMarker :show="isFieldPending('neighborhood')" />
              </label>
              <input id="beneficiary-neighborhood" :disabled="!isEditing" type="text" v-model="beneficiary.address.neighborhood"
                :class="{ 'pending-profile-field': isFieldPending('neighborhood') }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="beneficiary-cp" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Código postal <PendingFieldMarker :show="isFieldPending('cp')" />
              </label>
              <input id="beneficiary-cp" :disabled="!isEditing" type="number" v-model="beneficiary.address.cp"
                :class="{ 'pending-profile-field': isFieldPending('cp') }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ciudad</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.city"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Spouse/Tutor -->
        <div v-if="activeSection === 'spouse'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">CURP</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.spouseOrTutor.curp"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.spouseOrTutor.fullname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.spouseOrTutor.age"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input :disabled="!isEditing" v-maska="'(###) ### ####'" type="tel"
                v-model="beneficiary.spouseOrTutor.phone"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Trabajo</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.spouseOrTutor.work"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingresos</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.spouseOrTutor.income"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Relación</label>
              <select :disabled="!isEditing" v-model="beneficiary.spouseOrTutor.relationship"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CONYUGE">Cónyuge</option>
                <option value="TUTOR">Tutor</option>
              </select>
            </div>
            <!-- <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Comentarios</label>
              <textarea :disabled="!isEditing" v-model="beneficiary.spouseOrTutor.comments" rows="3"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div> -->
          </div>
        </div>

        <!-- Family -->
        <div v-if="activeSection === 'family'" class="space-y-6">
          <FamilyList :beneficiaryId="beneficiaryId" />
        </div>

        <!-- Home -->
        <div v-if="activeSection === 'home'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Vivienda</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.type"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CASA">Casa</option>
                <option value="DEPARTAMENTO">Departamento</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número de Habitaciones</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.home.roomNumber"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Pertenencia</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.belonging"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="PROPIA">Propia</option>
                <option value="RENTA">Renta</option>
                <option value="HIPOTECADA">Hipotecada</option>
                <option value="PRESTADA">Prestada</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de piso</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.floorType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="floorType in floorTypes" :key="floorType.id" :value="floorType.value">
                  {{ floorType.text }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de pared</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.wallType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="wallType in wallTypes" :key="wallType.id" :value="wallType.value">
                  {{ wallType.text }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de techo</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.ceilingType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="ceilingType in ceilingTypes" :key="ceilingType.id" :value="ceilingType.value">
                  {{ ceilingType.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveBathroom"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Baño</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveToilet"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Sanitario</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveDrainage"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Drenaje</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveSepticTank"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Fosa Séptica</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveWaterService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio de Agua</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveElectricService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio Eléctrico</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveAirConditioning"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Aire Acondicionado</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveTvService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio de TV</label>
            </div>
          </div>
        </div>

        <!-- Expenses -->
        <div v-if="activeSection === 'expenses'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="beneficiary-occupation" class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Ocupación <PendingFieldMarker :show="isFieldPending('occupation')" />
              </label>
              <input id="beneficiary-occupation" :disabled="!isEditing" type="text" v-model="beneficiary.occupation"
                :class="{ 'pending-profile-field': isFieldPending('occupation') }"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción laboral</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.occupationDescription"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingresos / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.income"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Transporte / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.transport"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Alimentación / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.meal"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio de TV / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.tvService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio de Agua / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.waterService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio Eléctrico / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.electricService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Otros Gastos / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.otherExpenses"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Contributions -->
        <div v-if="activeSection === 'contributions'" class="space-y-6">
          <ContributionHistory :contributions="beneficiary.contributions" :beneficiary="beneficiary"
            @update:list="getBeneficiary" />
        </div>

        <!-- Socioeconomic history -->
        <div v-if="activeSection === 'socioeconomicHistory'" class="space-y-6">
          <SocioeconomicHistory :beneficiary="beneficiary" @beneficiary-updated="getBeneficiary" />
        </div>

      </div>

      <div v-if="!loading" class="flex flex-col">
        <p class="text-gray-500 text-xs ms-2 mt-5">Registro creado: <span class="font-bold">{{
          formatDatetime(beneficiary.createdAt) }}</span> por: <span class="font-bold">{{ beneficiary.createdBy?.name
              + ' ' + beneficiary.createdBy?.lastname }}</span></p>
        <p class="text-gray-500 text-xs ms-2 mt-1">Ultima modificación: <span class="font-bold">{{
          formatDatetime(beneficiary.updatedAt) }}</span> por: <span class="font-bold">{{
              beneficiary.updatedBy ? beneficiary?.updatedBy?.name + ' ' + beneficiary?.updatedBy?.lastname : '' }}</span>
        </p>
      </div>
    </div>

    <!-- <ProfilePDF ref="profilePDFRef" :beneficiary="beneficiary" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import { IconArrowNarrowLeft, IconEdit, IconDeviceFloppy, IconCancel, IconUserCircle, IconMapPin, IconUserHeart, IconUsersGroup, IconHome, IconCoin, IconHeartHandshake, IconChartBar } from '@tabler/icons-vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';
import beneficiaryServices from '../services/beneficiaryServices';
import ContributionHistory from '@/components/BeneficiaryView/ContributionHistory.vue';
import FamilyList from '@/components/BeneficiaryView/FamilyList.vue';
import SocioeconomicHistory from '@/components/BeneficiaryView/SocioeconomicHistory.vue';
import { useAuth } from '../composables/useAuth';
import scholarships from '../constants/scholarships';
import medicalServices from '../constants/medicalServices';
import disabilityTypes from '../constants/disabilityTypes';
import floorTypes from '../constants/floorTypes';
import wallTypes from '../constants/wallTypes';
import ceilingTypes from '../constants/ceilingTypes';
import delegations from '../constants/delegations';
import { useDate } from '../utils/dateTool';
import { normalizeObjectTextProperties } from '../utils/normalizeObjectText';
import { getTranslatedError } from '../utils/errorManager';
import PhotoPicker from '@/components/BeneficiaryView/PhotoPicker.vue';
import CompletionBanner from '@/components/BeneficiaryView/CompletionBanner.vue';
import PendingFieldMarker from '@/components/BeneficiaryView/PendingFieldMarker.vue';
import { useProtectedImage } from '@/composables/useProtectedImage';
import { getMissingBeneficiaryFields, getMissingFieldCountBySection } from '@/utils/beneficiaryCompletion';
import { useRouter } from 'vue-router'

const { formatDate, formatDatetime } = useDate()
const router = useRouter()

//data
const beneficiaryId = router.currentRoute.value.params.id;
const beneficiary = ref({
  photo: '',
  name: '',
  fatherSurname: '',
  motherSurname: '',
  age: 0,
  birthdate: new Date(),
  birthplace: '',
  sex: 'HOMBRE',
  isIndigenousCommunity: false,
  indigenousCommunity: '',
  isLgbtq: false,
  sexualOrientation: 'HETEROSEXUAL',
  curp: '',
  phone: '',
  hasDisability: false,
  medicalService: '',
  disabilityType: '',
  civilStatus: '',
  scholarship: '',
  comments: '',
  registrationStatus: 'COMPLETE',
  address: {
    communityType: 'RURAL',
    delegation: '',
    subdelegation: '',
    street: '',
    sideStreets: '',
    extNum: '',
    intNum: '',
    neighborhood: '',
    cp: 0,
    city: ''
  },
  spouseOrTutor: {
    curp: '',
    fullname: '',
    age: 0,
    phone: '',
    work: '',
    income: 0,
    relationship: ''
  },
  home: {
    type: 'CASA',
    roomNumber: 0,
    belonging: '',
    floorType: '', //tipo de piso
    wallType: '', // tipo de pared
    ceilingType: '', // tipo de techo
    haveBathroom: false,
    haveToilet: false,
    haveDrainage: false,
    haveSepticTank: false,
    haveWaterService: false,
    haveElectricService: false,
    haveAirConditioning: false,
    haveTvService: false
  },
  expenses: {
    transport: 0,
    meal: 0,
    tvService: 0,
    waterService: 0,
    electricService: 0,
    otherExpenses: 0
  }
})
const subdelegations = ref([])
const loading = ref(false)
const loadingPrint = ref(false)
const loadingSave = ref(false)
const isEditing = ref(false)
const sections = [
  { title: 'Información general', id: 'general', icon: IconUserCircle },
  { title: 'Dirección', id: 'address', icon: IconMapPin },
  { title: 'Cónyuge o tutor', id: 'spouse', icon: IconUserHeart },
  { title: 'Familia', id: 'family', icon: IconUsersGroup },
  { title: 'Vivienda', id: 'home', icon: IconHome },
  { title: 'Situación económica', id: 'expenses', icon: IconCoin },
  { title: 'Apoyos', id: 'contributions', icon: IconHeartHandshake },
  { title: 'Estudios socioeconómicos', id: 'socioeconomicHistory', icon: IconChartBar }
]
const requestedSection = router.currentRoute.value.query.section
const activeSection = ref(sections.some(({ id }) => id === requestedSection) ? requestedSection : 'general')
const beneficiaryFullName = computed(() => [beneficiary.value.name, beneficiary.value.fatherSurname, beneficiary.value.motherSurname].filter(Boolean).join(' ') || 'Expediente del beneficiario')
const missingCompletionFields = computed(() => getMissingBeneficiaryFields(beneficiary.value))
const missingCompletionFieldKeys = computed(() => new Set(missingCompletionFields.value.map(({ key }) => key)))
const isPendingProfile = computed(() => beneficiary.value.registrationStatus === 'PENDING_COMPLETION')
const pendingFieldCountBySection = computed(() => isPendingProfile.value
  ? getMissingFieldCountBySection(missingCompletionFields.value)
  : {})
const isFieldPending = (key) => isPendingProfile.value && missingCompletionFieldKeys.value.has(key)
const beneficiaryPhotoPath = computed(() => beneficiary.value.photo);
const { imageUrl: photoUrl } = useProtectedImage(beneficiaryPhotoPath);

// composables
const { authHeader } = useAuth()

//methods

const getBeneficiary = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.getBeneficiary(beneficiaryId, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiary.value = {
        ...beneficiary.value,
        ...response.data,
        spouseOrTutor: {
          ...beneficiary.value.spouseOrTutor,
          ...response.data.spouseOrTutor
        }
      }
      getSubdelegations()
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loading.value = false
  }
}

const getSubdelegations = async () => {
  subdelegations.value = delegations.find(delegation => delegation.value === beneficiary.value.address.delegation)?.subdelegations
}

const toggleEditMode = () => {
  if (isEditing.value) {
    updateBeneficiary()
  } else {
    isEditing.value = !isEditing.value;
  }
}

const startCompletion = (section) => {
  activeSection.value = section
  isEditing.value = true
}

const updateBeneficiary = async () => {
  loadingSave.value = true
  // Crear una copia del objeto sin el campo _id
  let {
    _id,
    families,
    contributions,
    socioeconomicAssessments,
    documents,
    photo,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
    deleted,
    registrationStatus,
    registrationSource,
    __v,
    ...beneficiarySinId
  } = beneficiary.value;

  // Create a deep copy of the beneficiary data to avoid modifying the original
  const beneficiaryToUpdate = JSON.parse(JSON.stringify(beneficiarySinId));

  // Ensure birthdate is properly formatted as an ISO string
  if (beneficiaryToUpdate.birthdate instanceof Date) {
    beneficiaryToUpdate.birthdate = beneficiaryToUpdate.birthdate.toISOString();
  } else if (beneficiaryToUpdate.birthdate && typeof beneficiaryToUpdate.birthdate === 'object') {
    // If it's already an object (like from date picker), convert to ISO string
    beneficiaryToUpdate.birthdate = new Date(
      beneficiaryToUpdate.birthdate.year,
      beneficiaryToUpdate.birthdate.month - 1,
      beneficiaryToUpdate.birthdate.day
    ).toISOString();
  }

  try {
    const payload = {
      filter: _id,
      update: normalizeObjectTextProperties(beneficiaryToUpdate)
    }
    const response = await beneficiaryServices.updateBeneficiary(payload, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      toast.success('Beneficiario actualizado correctamente')
      await getBeneficiary()
      isEditing.value = false;
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(getTranslatedError(err))
    } else {
      toast.error(err?.message || 'No se pudieron guardar los cambios')
    }
  } finally {
    loadingSave.value = false
  }
}

// Birthdate handling
const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Function to calculate age from birthdate
const calculateAge = (birthDate) => {
  if (!birthDate) return 0;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age > 0 ? age : 0;
};

// Function to calculate birthdate from age
const calculateBirthdateFromAge = (age) => {
  if (!age || isNaN(age)) return null;

  const today = new Date();
  const birthYear = today.getFullYear() - parseInt(age);
  return new Date(birthYear, today.getMonth(), today.getDate());
};

const birthdateInput = ref(formatDateForInput(beneficiary.value.birthdate));
const formattedBirthdate = computed(() => {
  if (!beneficiary.value.birthdate) return '';
  return formatDate(beneficiary.value.birthdate);
});

// Watch for changes in the date input
watch(birthdateInput, (newDate) => {
  if (newDate) {
    const [year, month, day] = newDate.split('-').map(Number);
    const newBirthdate = new Date(year, month - 1, day);
    beneficiary.value.birthdate = newBirthdate;

    // Update age when birthdate changes
    beneficiary.value.age = calculateAge(newBirthdate);
  } else {
    beneficiary.value.birthdate = null;
    beneficiary.value.age = 0;
  }
});

// Watch for changes in the age input
watch(() => beneficiary.value.age, (newAge, oldAge) => {
  // Only update if age is a valid number and different from previous value
  if (newAge && !isNaN(newAge) && newAge !== oldAge) {
    const newBirthdate = calculateBirthdateFromAge(newAge);
    if (newBirthdate) {
      beneficiary.value.birthdate = newBirthdate;
      birthdateInput.value = formatDateForInput(newBirthdate);
    }
  }
});

// Watch for external changes to the birthdate
watch(() => beneficiary.value.birthdate, (newDate) => {
  if (newDate) {
    birthdateInput.value = formatDateForInput(newDate);
    // Update age when birthdate changes externally
    beneficiary.value.age = calculateAge(newDate);
  } else {
    birthdateInput.value = '';
    beneficiary.value.age = 0;
  }
}, { immediate: true });

onMounted(() => {
  getBeneficiary()
})

const goBack = () => {
  router.go(-1)
}

// Eventos de PDF
// const profilePDFRef = ref()
// const exportToPDF = async () => {
//   loadingPrint.value = true
//   await profilePDFRef.value.generateProfilePDF()
//   loadingPrint.value = false
// }
</script>

<style scoped>
.pending-profile-field {
  border-color: rgb(217 119 6);
  background-color: rgb(255 251 235);
  box-shadow: 0 0 0 1px rgb(217 119 6 / 0.14);
}
</style>
