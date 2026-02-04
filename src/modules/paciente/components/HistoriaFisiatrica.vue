<template>
  <div class="p-4">
    <!-- Header con botón de crear nueva historia -->
    <div v-if="crearHistoriaFisiatrica"class="flex justify-content-between align-items-center mb-4">
      <h3 class="text-xl font-bold text-color-primary">Historia Fisiátrica</h3>
      <Button 
        label="Crear Nueva Historia Fisiátrica" 
        icon="pi pi-plus"
        @click="crearNuevaHistoria"
        class="button-primary-custom"
      />
    </div>

    <!-- Tabs de navegación de la historia -->
    <div v-if="!crearHistoriaFisiatrica" class="bg-white border-round-xl shadow-sm border border-gray-100 mb-6">
      <div class="flex border-bottom-1 border-gray-200">
        <button 
          v-for="(tabHistoria, index) in tabsHistoria" 
          :key="tabHistoria.id"
          @click="tabHistoriaActivo = index"
          :class="[
            'flex-1 p-2 text-center border-none cursor-pointer transition-all duration-200',
            tabHistoriaActivo === index 
              ? 'bg-white text-color-primary border-bottom-2 border-color-primary' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ tabHistoria.label }}
        </button>
      </div>
      <!-- Contenido de los tabs de historia -->
      <div class="p-4">
        <!-- Tab Evaluación y Consulta -->
        <div v-if="tabHistoriaActivo === 0">
          <div class="w-full">
            <div class="flex justify-content-between align-items-center">
              <h4 class="text-lg font-semibold mb-4 text-color-primary">Evaluación y Consulta</h4> 
              <div class="mb-4 flex gap-2">
                <label class="block text-900 font-medium mb-2 text-color-primary">Fecha de Evaluación: </label>
                <p class="mb-2"> {{ valorParaMostrar(formatearFecha(historiaFisiatica.fechaEvaluacion)) }}</p>
              </div>
            </div>
            <div class="mb-4 md:col-span-2">
              <label class="block text-900 font-medium mb-2 text-color-primary">Derivados por</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.derivadosPor) }}</p>
              </div>
            </div>
            <div class="mb-4 md:col-span-2">
              <label class="block text-900 font-medium mb-2 text-color-primary">Antecedentes del cuadro actual</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.antecedentesCuadro) }}</p>
              </div>
            </div>
            <div class="mb-4 md:col-span-2">
              <label class="block text-900 font-medium mb-2 text-color-primary">Medicación actual</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.medicacionActual) }}</p>
              </div>
            </div>
            <div class="mb-4 md:col-span-2">
              <label class="block text-900 font-medium mb-2 text-color-primary">Estudios realizados</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.estudiosRealizados) }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Tab Antecedentes -->
        <div v-else-if="tabHistoriaActivo === 1">
          <h4 class="text-lg font-semibold mb-4 text-color-primary">Antecedentes</h4> 
          <!-- Secciones principales -->
          <div>
            <!-- Hereditarios -->
            <div class="mb-4">
              <label class="block text-900 font-medium mb-2 text-color-primary">Hereditarios</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.antecedentesHereditarios) }}</p>
              </div>
            </div>
            <!-- Patológicos -->
            <div class="mb-4">
              <label class="block text-900 font-medium mb-2 text-color-primary">Patológico</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.antecedentesPatologicos) }}</p>
              </div>
            </div>
            <!-- Quirúrgicos -->
            <div class="mb-4">
              <label class="block text-900 font-medium mb-2 text-color-primary">Quirúrgicos</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.antecedentesQuirurgicos) }}</p>
              </div>
            </div>
            <!-- Metabólicos -->
            <div class="mb-4">
              <label class="block text-900 font-medium mb-2 text-color-primary">Metabólicos</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.antecedentesMetabolicos) }}</p>
              </div>
            </div>
            <!-- Inmunológicos -->
            <div class="mb-4">
              <label class="block text-900 font-medium mb-2 text-color-primary">Inmunológicos</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                <p>{{ valorParaMostrar(historiaFisiatica.antecedentesInmunologicos) }}</p>
              </div>
            </div>
            <!-- Fisiológicos - Layout de dos columnas -->
            <div class="flex flex-column mb-4 w-full">
              <label class="font-bold text-color-primary">Fisiológicos</label>
              <div>
                
              </div>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div class="col-span-2">
                  <label class="block text-900 font-medium mb-2 text-sm">Dormir</label>
                  <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                    <p>{{ valorParaMostrar(historiaFisiatica.fisiologicosDormir) }}</p>
                  </div>
                </div> 
                <div class="col-span-2">
                  <label class="block text-900 font-medium mb-2 text-sm">Catarsis</label>
                  <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                    <p>{{ valorParaMostrar(historiaFisiatica.fisiologicosCatarsis) }}</p>
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="block text-900 font-medium mb-2 text-sm">Periodo menstrual</label>
                  <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                    <p>{{ valorParaMostrar(historiaFisiatica.fisiologicosPeriodoMenstrual) }}</p>
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="block text-900 font-medium mb-2 text-sm">Alimentación</label>
                  <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                    <p>{{ valorParaMostrar(historiaFisiatica.fisiologicosAlimentacion) }}</p>
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="block text-900 font-medium mb-2 text-sm">Diuresis</label>
                  <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                    <p>{{ valorParaMostrar(historiaFisiatica.fisiologicosDiuresis) }}</p>
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="block text-900 font-medium mb-2 text-sm">Sexualidad</label>
                  <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                    <p>{{ valorParaMostrar(historiaFisiatica.fisiologicosSexualidad) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Tab Anamnesis Sistémica -->
        <div v-else-if="tabHistoriaActivo === 2">
          <h4 class="text-lg font-semibold mb-4 text-color-primary">Anamnesis Sistémica</h4>
          <div class="flex flex-column gap-4">
            <div class="">
              <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades de comunicación</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                <p>{{ valorParaMostrar(historiaFisiatica.anamnesisComunicacion) }}</p>
              </div>
            </div>
            <div class="">
              <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades en motricidad</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                <p>{{ valorParaMostrar(historiaFisiatica.anamnesisMotricidad) }}</p>
              </div>
            </div>
            <div class="">
              <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades de la vida diaria</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                <p>{{ valorParaMostrar(historiaFisiatica.anamnesisVidaDiaria) }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Tab Examen Físico -->
        <div v-else-if="tabHistoriaActivo === 3">
          <h4 class="text-lg font-semibold mb-4 text-color-primary">Examen Físico</h4>
          <div class="bg-white border-round-xl shadow-sm border border-gray-100 mb-6">
            <div class="flex border-bottom-1 border-gray-200">
              <button 
                v-for="(subTab, index) in subTabsExamenFisico" 
                :key="subTab.id"
                @click="subTabExamenFisicoActivo = index"
                :class="[
                  'flex-1 p-2 text-center border-none cursor-pointer transition-all duration-200',
                  subTabExamenFisicoActivo === index 
                    ? 'bg-white text-color-primary border-bottom-2 border-color-primary' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                ]"
              >
                {{ subTab.label }}
              </button>
            </div>
            <div class="p-4">
              <div v-if="subTabExamenFisicoActivo === 0">
                <h5 class="text-md font-semibold mb-4 text-color-primary">General</h5>
                <div class="flex flex-column gap-4">
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Actitud</label>
                    <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                      <p>{{ valorParaMostrar(historiaFisiatica.examenActitud) }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Comunicación y códigos</label>
                    <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                      <p>{{ valorParaMostrar(historiaFisiatica.examenComunicacionCodigos) }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Piel y faneras</label>
                    <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                      <p>{{ valorParaMostrar(historiaFisiatica.examenPielFaneras) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Sub-tab Cabeza y sentidos -->
              <div v-else-if="subTabExamenFisicoActivo === 1">
                <h5 class="text-md font-semibold mb-4 text-color-primary">Cabeza y sentidos</h5>
                <div class="flex flex-column gap-4">
                  <div class="flex flex-column gap-4">
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Cabeza</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenCabeza) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Movimientos anormales</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenMovimientosAnormales) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Orejas</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenOrejas) }}</p>
                      </div>
                    </div>
                  </div>                            
                  <div class="flex flex-column gap-4">
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Ojos</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenOjos) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Estrabismo</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenEstrabismo) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Audición</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenAudicion) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Labios</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenLabios) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Dentición</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenDenticion) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Paladar y velo</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenPaladarVelo) }}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block font-bold mb-2 text-color-primary text-lg">Complejo orofacial</label>
                    <div class="ml-4 mb-3">
                      <label class="block text-900 font-medium mb-2 text-sm">Boca</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenBoca) }}</p>
                      </div>
                    </div>
                    <div class="ml-4 mb-3">
                      <label class="block text-900 font-medium mb-2 text-sm">Lengua</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenLengua) }}</p>
                      </div>
                    </div>
                    <div class="ml-4 mb-3">
                      <label class="block text-900 font-medium mb-2 text-sm">Mordida</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenMordida) }}</p>
                      </div>
                    </div>
                    <div class="ml-4 mb-3">
                      <label class="block text-900 font-medium mb-2 text-sm">Maxilares</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenMaxilares) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Sub-tab Tronco y extremidades -->
              <div v-else-if="subTabExamenFisicoActivo === 2">
                <h5 class="text-md font-semibold mb-4 text-color-primary">Tronco y extremidades</h5>
                <div class="flex flex-column gap-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Tórax</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenTorax) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Columna vertebral</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenColumnaVertebral) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Caderas</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenCaderas) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Pies</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenPies) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Manos</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenManos) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Abdomen</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenAbdomen) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Pelvis</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenPelvis) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">M.M.I.I.</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenMMII) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">M.M.S.S.</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenMMSS) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Lateralidad</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenLateralidad) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Sub-tab Sistema y actividades -->
              <div v-else-if="subTabExamenFisicoActivo === 3">
                <h5 class="text-md font-semibold mb-4 text-color-primary">Sistema y actividades</h5>
                <div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Respiratorio</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenApRespiratorio) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Digestivo</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenApDigestivo) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Actividad sensoperceptual</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenActividadSensoperceptual) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Desplazamiento-marcha</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenDesplazamientoMarcha) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Cardiovascular</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenApCardiovascular) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Actividad refleja</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenActividadRefleja) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Reacciones posturales</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenReaccionesPosturales) }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Etapa del desarrollo</label>
                      <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                        <p>{{ valorParaMostrar(historiaFisiatica.examenEtapaDesarrollo) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Tab Diagnóstico Funcional -->
        <div v-else-if="tabHistoriaActivo === 4">
          <h4 class="text-lg font-semibold mb-4 text-color-primary">Diagnóstico Funcional</h4>
          <div class="flex flex-column gap-4">
            <div>
              <label class="block text-900 font-medium mb-2 text-color-primary">Diagnóstico Funcional</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                <p>{{ valorParaMostrar(historiaFisiatica.diagnosticoFuncional) }}</p>
              </div>
            </div>
            <div>
              <label class="block text-900 font-medium mb-2 text-color-primary">Conducta a seguir, objetivos</label>
              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                <p>{{ valorParaMostrar(historiaFisiatica.conductaSeguirObjetivos) }}</p>
              </div>
            </div>
            <div>
              <label class="block text-900 font-medium mb-2 text-color-primary">Objetivos de la familia</label>
              <div class="border-round-xl px-3 shadow-md" style="max-height: 80px;">
                <p>{{ valorParaMostrar(historiaFisiatica.objetivosFamilia) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h4 class="text-lg text-gray-600 mb-2">No hay historia fisiátrica</h4>
      <p class="text-gray-500">Crea la primera historia fisiática para este paciente</p>
    </div>
  </div>
 </template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePacienteStore } from '../store';

const route = useRoute();
const router = useRouter();

const pacienteStore = usePacienteStore();

const tabHistoriaActivo = ref(0);
const subTabExamenFisicoActivo = ref(0);

const props = defineProps({
  crearHistoriaFisiatrica: {
    type: Boolean,
    default: false,
    required: true
  },
  historiaParaMostrar: {
    type: Object,
    default: null
  }
});

const tabsHistoria = ref([
  { id: 1, label: 'Evaluación y Consulta' },
  { id: 2, label: 'Antecedentes' },
  { id: 3, label: 'Anamnesis Sistémica' },
  { id: 4, label: 'Examen Físico' },
  { id: 5, label: 'Diagnóstico Funcional' }
]);

const subTabsExamenFisico = ref([
  { id: 1, label: 'General' },
  { id: 2, label: 'Cabeza y sentidos' },
  { id: 3, label: 'Tronco y extremidades' },
  { id: 4, label: 'Sistema y actividades' }
]);

const historiaFisiatica = computed(() => {
  const raw = props.historiaParaMostrar ?? pacienteStore.historiaFisiatrica;
  if (!raw) return {};
  return {
    ...raw,
    fechaEvaluacion: raw.fechaEvaluacion ?? raw.fechaCreacion ?? 'Sin información'
  };
});

/** Muestra "No informado" cuando el valor es null, vacío o "Sin información". */
const valorParaMostrar = (val) => (val && val !== 'Sin información' ? val : 'No informado');

// Formatear fecha de evaluación a formato legible DD/MM/YYYY
const formatearFecha = (fecha) => {
  if (!fecha || fecha === 'Sin información') return 'Sin información';
  
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate().toString().padStart(2, '0');
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
  const año = fechaObj.getFullYear();
  
  return `${dia}/${mes}/${año}`;
};

const crearNuevaHistoria = () => {
  router.push(`/pacientes/${route.params.id}/nueva-historia`);
};
</script>

<style scoped>
.text-color-primary{
  color: #7c3aed;
}

.button-primary-custom{
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  color: white !important;
}

.text-900 {
  color: #111827;
}

.font-medium {
  font-weight: 500;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-md {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-lg {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.ml-4 {
  margin-left: 1rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.md\:col-span-2 {
  grid-column: span 2 / span 2;
}
</style>

