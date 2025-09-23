<template>
  <div class="page-container p-4 border-round">

    <!-- Header del paciente -->
    <div class="border-round-xl shadow-sm border border-gray-100 p-6 mb-4 bg-white">
      <div class="flex md:flex-row align-items-start gap-4">
        <div class="flex-shrink-0">
          <Avatar 
            :label="pacienteStore.paciente.iniciales"
            size="xlarge"
            shape="square"
            class="bg-primary text-white text-4xl font-bold"
            style="width: 80px; height: 80px;"
          />
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-color-primary mb-3">{{ pacienteStore.paciente.nombre + ' ' + pacienteStore.paciente.apellido }}</h1>
          <div class="flex flex-column sm:flex-row gap-4 text-gray-600">
            <p class="mb-0"><strong>DNI:</strong> {{ pacienteStore.paciente.dni }}</p>
            <p class="mb-0"><strong>Prestación:</strong> {{ pacienteStore.paciente.prestacion }}</p>
            <p class="mb-0"><strong>Últ. Modificación:</strong> {{ formatearFecha(pacienteStore.paciente.ultimaModificacion) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border-round-xl shadow-sm border border-gray-100 mb-6">
      <div class="flex border-bottom-1 border-gray-200">
        <button 
          v-for="(tab, index) in tabs" 
          :key="tab.label"
          @click="tabActivo = tab.label"
          :class="[
            'flex-1 p-3 text-center border-none cursor-pointer transition-all duration-200',
            tabActivo === tab.label 
              ? 'bg-white text-color-primary border-bottom-2 border-color-primary' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Contenido de los tabs principales -->
      <div class="p-4">
        <!-- Tab Informes -->
        <div v-if="tabActivo === 'Informes'">
          <!-- Header con botón de crear nuevo informe -->
          <div class="flex justify-content-between align-items-center mb-4">
            <h3 class="text-xl font-bold text-color-primary">Informes</h3>
            <Button 
              label="Crear Nuevo Informe" 
              icon="pi pi-plus"
              @click="crearNuevoInforme"
              class="button-primary-custom"
            />
          </div>
          
          <!-- Lista de informes dinámicos -->
          <div v-if="informes.length === 0" class="text-center p-6">
            <i class="pi pi-file-text text-6xl text-gray-400 mb-4"></i>
            <h4 class="text-lg text-gray-600 mb-2">No hay informes disponibles</h4>
            <p class="text-gray-500">Crea el primer informe para este paciente</p>
          </div>
          
          <div v-else>
            <div 
              v-for="informe in informes" 
              :key="informe.id"
              class="informe-bg border-round-xl p-3 shadow-md my-3"
            >
              <div class="flex flex-column sm:flex-row justify-content-between align-items-start mb-3">
                <h3 class="text-xl font-bold mt-1 sm:mb-0" style="color: #7c3aed;">{{ informe.titulo }}</h3>
                <div class="text-right text-gray-500 text-sm">
                  <p class="mb-2 font-bold" style="color: #7c3aed;">{{ informe.profesional.nombreCompleto }}</p>
                  <p class="mb-0">Fecha: {{ informe.fechaCreacion }}</p>
                  <p class="mb-0 text-xs" v-if="informe.tipoInforme.nombre">Tipo: {{ informe.tipoInforme.nombre }}</p>
                </div>
              </div>
              
              <div class="mb-4">
                <Textarea 
                  :value="informe.contenido" 
                  :autoResize="true" 
                  :rows="rows" 
                  readonly
                  class="w-full border-gray-300"
                  style="min-height: 120px;"
                />
              </div>
              
              <!-- Comentarios (anexos) si existen -->
              <div v-if="informe.anexos && informe.anexos.length > 0" class="mb-4">
                <h5 class="text-sm font-semibold text-gray-600 mb-2">Comentarios:</h5>
                <div class="space-y-2">
                  <div 
                    v-for="anexo in informe.anexos" 
                    :key="anexo.id"
                    class="bg-gray-50 border-round p-3 border border-gray-200"
                  >
                    <div class="flex justify-content-between align-items-start mb-2">
                      <span class="text-sm font-semibold text-color-primary">{{ anexo.titulo }}</span>
                      <span class="text-xs text-gray-500">{{ anexo.fechaCreacion }}</span>
                    </div>
                    <p class="text-sm text-gray-700 m-0">{{ anexo.contenido }}</p>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-column sm:flex-row gap-3 justify-content-end">
                <Button 
                  label="Agregar comentario" 
                  @click="agregarComentario(informe)"
                  class="p-button-outlined p-button-primary"
                />
                <Button 
                  label="Ver" 
                  @click="verInforme(informe)"
                  class="p-button-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Historia Fisiátrica -->
        <div v-else-if="tabActivo === 'Historia Fisiátrica'">
          <div class="p-4">
            <!-- Header con botón de crear nueva historia -->
            <div class="flex justify-content-between align-items-center mb-4">
              <h3 class="text-xl font-bold text-color-primary">Historia Fisiátrica</h3>
              <Button 
                label="Crear Nueva Historia Fisiátrica" 
                icon="pi pi-plus"
                @click="crearNuevaHistoria"
                class="button-primary-custom"
              />
            </div>

            <!-- Tabs de navegación de la historia -->
            <div class="bg-white border-round-xl shadow-sm border border-gray-100 mb-6">
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
                          <p class="mb-2"> {{ historiaFisiatica.fechaEvaluacion }}</p>
                        </div>
                      </div>
                      <div class="mb-4 md:col-span-2">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Derivados por</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                          <p>{{ historiaFisiatica.derivadosPor }}</p>
                        </div>
                      </div>
                      <div class="mb-4 md:col-span-2">
                         <label class="block text-900 font-medium mb-2 text-color-primary">Antecedentes del cuadro actual</label>
                         <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                           <p>{{ historiaFisiatica.antecedentesCuadro }}</p>
                         </div>
                       </div>
                       <div class="mb-4 md:col-span-2">
                         <label class="block text-900 font-medium mb-2 text-color-primary">Medicación actual</label>
                         <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                           <p>{{ historiaFisiatica.medicacionActual }}</p>
                         </div>
                       </div>
                       <div class="mb-4 md:col-span-2">
                         <label class="block text-900 font-medium mb-2 text-color-primary">Estudios realizados</label>
                         <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                           <p>{{ historiaFisiatica.estudiosRealizados }}</p>
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
                          <p>{{ historiaFisiatica.antecedentesHereditarios }}</p>
                        </div>
                      </div>
                      <!-- Patológicos -->
                      <div class="mb-4">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Patológico</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                          <p>{{ historiaFisiatica.antecedentesPatologicos }}</p>
                        </div>
                      </div>
                      <!-- Quirúrgicos -->
                      <div class="mb-4">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Quirúrgicos</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                          <p>{{ historiaFisiatica.antecedentesQuirurgicos }}</p>
                        </div>
                      </div>
                      <!-- Metabólicos -->
                      <div class="mb-4">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Metabólicos</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                          <p>{{ historiaFisiatica.antecedentesMetabolicos }}</p>
                        </div>
                      </div>
                      <!-- Inmunológicos -->
                      <div class="mb-4">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Inmunológicos</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 120px;">
                          <p>{{ historiaFisiatica.antecedentesInmunologicos }}</p>
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
                              <p>{{ historiaFisiatica.fisiologicosDormir }}</p>
                            </div>
                          </div> 
                          <div class="col-span-2">
                            <label class="block text-900 font-medium mb-2 text-sm">Catarsis</label>
                            <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                              <p>{{ historiaFisiatica.fisiologicosCatarsis }}</p>
                            </div>
                          </div>
                          <div class="col-span-2">
                            <label class="block text-900 font-medium mb-2 text-sm">Periodo menstrual</label>
                            <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                              <p>{{ historiaFisiatica.fisiologicosPeriodoMenstrual }}</p>
                            </div>
                          </div>
                          <div class="col-span-2">
                            <label class="block text-900 font-medium mb-2 text-sm">Alimentación</label>
                            <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                              <p>{{ historiaFisiatica.fisiologicosAlimentacion }}</p>
                            </div>
                          </div>
                          <div class="col-span-2">
                            <label class="block text-900 font-medium mb-2 text-sm">Diuresis</label>
                            <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                              <p>{{ historiaFisiatica.fisiologicosDiuresis }}</p>
                            </div>
                          </div>
                          <div class="col-span-2">
                            <label class="block text-900 font-medium mb-2 text-sm">Sexualidad</label>
                            <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                              <p>{{ historiaFisiatica.fisiologicosSexualidad }}</p>
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
                          <p>{{ historiaFisiatica.anamnesisComunicacion }}</p>
                        </div>
                      </div>
                      <div class="">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades en motricidad</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                          <p>{{ historiaFisiatica.anamnesisMotricidad }}</p>
                        </div>
                      </div>
                      <div class="">
                        <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades de la vida diaria</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                          <p>{{ historiaFisiatica.anamnesisVidaDiaria }}</p>
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
                                <p>{{ historiaFisiatica.examenActitud }}</p>
                              </div>
                            </div>
                            <div>
                              <label class="block text-900 font-medium mb-2 text-color-primary">Comunicación y códigos</label>
                              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                <p>{{ historiaFisiatica.examenComunicacionCodigos }}</p>
                              </div>
                            </div>
                            <div>
                              <label class="block text-900 font-medium mb-2 text-color-primary">Piel y faneras</label>
                              <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                <p>{{ historiaFisiatica.examenPielFaneras }}</p>
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
                                  <p>{{ historiaFisiatica.examenCabeza }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Movimientos anormales</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenMovimientosAnormales }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Orejas</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenOrejas }}</p>
                                </div>
                              </div>
                            </div>                            
                            <div class="flex flex-column gap-4">
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Ojos</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenOjos }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Estrabismo</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenEstrabismo }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Audición</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenAudicion }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Labios</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenLabios }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Dentición</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenDenticion }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Paladar y velo</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenPaladarVelo }}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label class="block font-bold mb-2 text-color-primary text-lg">Complejo orofacial</label>
                              <div class="ml-4 mb-3">
                                <label class="block text-900 font-medium mb-2 text-sm">Boca</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenBoca }}</p>
                                </div>
                              </div>
                              <div class="ml-4 mb-3">
                                <label class="block text-900 font-medium mb-2 text-sm">Lengua</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenLengua }}</p>
                                </div>
                              </div>
                              <div class="ml-4 mb-3">
                                <label class="block text-900 font-medium mb-2 text-sm">Mordida</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenMordida }}</p>
                                </div>
                              </div>
                              <div class="ml-4 mb-3">
                                <label class="block text-900 font-medium mb-2 text-sm">Maxilares</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenMaxilares }}</p>
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
                                  <p>{{ historiaFisiatica.examenTorax }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Columna vertebral</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenColumnaVertebral }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Caderas</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenCaderas }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Pies</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenPies }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Manos</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenManos }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Abdomen</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenAbdomen }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Pelvis</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenPelvis }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">M.M.I.I.</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenMMII }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">M.M.S.S.</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenMMSS }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Lateralidad</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenLateralidad }}</p>
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
                                  <p>{{ historiaFisiatica.examenApRespiratorio }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Digestivo</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenApDigestivo }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Actividad sensoperceptual</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenActividadSensoperceptual }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Desplazamiento-marcha</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenDesplazamientoMarcha }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Cardiovascular</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenApCardiovascular }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Actividad refleja</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenActividadRefleja }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Reacciones posturales</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenReaccionesPosturales }}</p>
                                </div>
                              </div>
                              <div>
                                <label class="block text-900 font-medium mb-2 text-color-primary">Etapa del desarrollo</label>
                                <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                                  <p>{{ historiaFisiatica.examenEtapaDesarrollo }}</p>
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
                          <p>{{ historiaFisiatica.diagnosticoFuncional }}</p>
                        </div>
                      </div>
                      <div>
                        <label class="block text-900 font-medium mb-2 text-color-primary">Conducta a seguir, objetivos</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                          <p>{{ historiaFisiatica.conductaSeguirObjetivos }}</p>
                        </div>
                      </div>
                      <div>
                        <label class="block text-900 font-medium mb-2 text-color-primary">Objetivos de la familia</label>
                        <div class="border-round-xl p-3 shadow-md" style="max-height: 80px;">
                          <p>{{ historiaFisiatica.objetivosFamilia }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Multimedia -->
        <div v-if="tabActivo === 'Multimedia'">
          <div class="p-4">
            <!-- Header con botones de acción -->
            <div class="flex justify-content-between align-items-center mb-4">
              <h3 class="text-xl font-bold text-color-primary">Multimedia</h3>
              <div class="flex gap-3">
                <Button 
                  label="Agregar Imagen" 
                  icon="pi pi-image"
                  @click="agregarImagen"
                  class="p-button-primary"
                />
                <Button 
                  label="Agregar Video" 
                  icon="pi pi-video"
                  @click="agregarVideo"
                  class="p-button-primary"
                />
              </div>
            </div>

            <!-- Sección de Imágenes -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-3 text-color-primary">Imágenes</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="imagen in imagenes" 
                  :key="imagen.id"
                  class="bg-white border-round-xl p-3 shadow-md"
                >
                  <div class="text-center mb-3">
                    <img 
                      :src="imagen.thumbnail" 
                      :alt="imagen.nombre"
                      class="w-full h-32 object-cover border-round"
                      @click="verImagen(imagen)"
                      style="cursor: pointer;"
                    />
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-600 mb-1 font-mono">{{ imagen.nombre }}</p>
                    <p class="text-xs text-gray-500 mb-2">{{ imagen.fecha }}</p>
                    <Button 
                      label="Ver imagen" 
                      @click="verImagen(imagen)"
                      class="p-button-text p-button-link text-color-primary p-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de Videos -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-3 text-color-primary">Videos</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="video in videos" 
                  :key="video.id"
                  class="bg-white border-round-xl p-3 shadow-md"
                >
                  <div class="text-center mb-3">
                    <div 
                      class="w-full h-32 bg-gray-100 border-round flex align-items-center justify-content-center"
                      @click="verVideo(video)"
                      style="cursor: pointer;"
                    >
                      <i class="pi pi-video text-4xl text-gray-400"></i>
                    </div>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-600 mb-1 font-mono">{{ video.nombre }}</p>
                    <p class="text-xs text-gray-500 mb-2">{{ video.fecha }}</p>
                    <Button 
                      label="Ver video" 
                      @click="verVideo(video)"
                      class="p-button-text p-button-link text-color-primary p-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje cuando no hay contenido -->
            <div v-if="imagenes.length === 0 && videos.length === 0" class="text-center p-6">
              <i class="pi pi-images text-3xl text-gray-400 mb-3"></i>
              <p class="text-gray-500">No hay contenido multimedia disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Ver Informe -->
    <Dialog 
      v-model:visible="modalVerVisible" 
      :header="`Informe: ${informeSeleccionado?.titulo || ''}`"
      :style="{ width: '80vw' }" 
      :maximizable="true"
      class="p-fluid"
    >
      <div v-if="informeSeleccionado" class="pb-4">
        <!-- Información del informe -->
        <div class="mb-4 p-4 informe-bg border-round">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="text-xl font-bold text-color-primary m-0">{{ informeSeleccionado.titulo }}</h3>
            <div class="text-right text-gray-600">
              <p class="mb-1 font-semibold text-color-primary">{{ informeSeleccionado.profesional }}</p>
              <p class="mb-0">{{ informeSeleccionado.fecha }}</p>
            </div>
          </div>
          <div class="mb-3">
            <Textarea 
              v-model="informeSeleccionado.contenido" 
              :autoResize="true" 
              :rows="8" 
              readonly
              class="w-full"
            />
          </div>
          
          <!-- Comentarios (anexos) del informe -->
          <div v-if="informeSeleccionado.anexos && informeSeleccionado.anexos.length > 0" class="mb-4">
            <h4 class="text-lg font-semibold mb-3 text-color-primary">Comentarios del Informe</h4>
            <div class="space-y-3">
              <div 
                v-for="anexo in informeSeleccionado.anexos" 
                :key="anexo.id"
                class="border-round border border-gray-200 p-4 bg-gray-50"
              >
                <div class="flex justify-content-between align-items-start mb-3">
                  <div class="flex align-items-center">
                    <i class="pi pi-comment text-color-primary mr-2"></i>
                    <span class="font-semibold text-color-primary">{{ anexo.titulo }}</span>
                  </div>
                  <span class="text-sm text-gray-500">{{ anexo.fechaCreacion }}</span>
                </div>
                <p class="text-gray-700 m-0">{{ anexo.contenido }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comentarios del informe -->
        <div class="mb-4">
          <h4 class="text-lg font-semibold mb-3 text-color-primary">Comentarios</h4>
          <div v-if="comentarioLoading" class="text-center p-4 text-gray-500">
            <ProgressSpinner/>
          </div>
          <div v-else-if="comentarios && comentarios.length > 0">
            <Divider/>
            <div 
              v-for="(comentario, index) in comentarios" 
              :key="index"
              class=" bg-white border-round border border-gray-200"
            >
              <div class="flex justify-content-between align-items-start mb-2">
                <span class="font-semibold text-color-primary">{{ comentario.profesional.nombre }} {{ comentario.profesional.apellido }}</span>
                <span class="text-sm text-gray-500">{{ comentario.fechaCreacion }}</span>
              </div>
              <p class="text-gray-700 m-0">{{ comentario.contenido }}</p>
              <Divider/>
            </div>
          </div>
          <div v-else class="text-center p-4 text-gray-500"> 
            <i class="pi pi-comment text-2xl mb-2"></i>
            <p>No hay comentarios para este informe</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cerrar" 
          @click="modalVerVisible = false"
          class="back-button mt-3"
        />
      </template>
    </Dialog>

    <!-- Modal para Agregar Comentario -->
    <Dialog 
      v-model:visible="modalComentarioVisible" 
      header="Agregar Comentario"
      :style="{ width: '50vw' }" 
      class="p-fluid"
    >
      <div>
        <div class="mb-4">
          <h4 class=" m-0 mb-2 text-color-primary">Informe</h4>
          <div class="py-2 px-3 informe-bg border-round-xl">
            <h4 class="text-lg font-semibold m-0">{{ informeSeleccionado?.titulo }}</h4>
            <p class="text-gray-600 m-0 text-right">{{ informeSeleccionado?.profesional }} - {{ informeSeleccionado?.fecha }}</p>
          </div>
        </div>
        <div class="mb-4">
          <label for="nuevoComentario" class="block text-900 font-medium mb-2 text-color-primart">Comentario</label>
          <Textarea 
            id="nuevoComentario"
            v-model="nuevoComentario" 
            :autoResize="true" 
            :rows="6" 
            placeholder="Escribe tu comentario aquí..."
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button 
          label="Cancelar" 
          @click="modalComentarioVisible = false"
          class="back-button"
        />
        <Button 
          label="Guardar Comentario" 
          @click="guardarComentario"
          class="button-primary-custom"
          :disabled="!nuevoComentario.trim()"
        />
      </template>
    </Dialog>

    <!-- Modal para Agregar Multimedia -->
    <Dialog 
      v-model:visible="modalMultimediaVisible" 
      :header="`Agregar ${tipoMultimedia === 'imagen' ? 'Imagen' : 'Video'}`"
      :style="{ width: '50vw' }" 
      class="p-fluid"
    >
      <div>
        <div class="mb-4">
          <label for="tituloMultimedia" class="block text-900 font-medium mb-2 text-color-primary">Título</label>
          <InputText 
            id="tituloMultimedia"
            v-model="nuevoMultimedia.titulo" 
            placeholder="Ingrese un título descriptivo"
            class="w-full"
          />
        </div>
        
        <div class="mb-4">
          <label for="descripcionMultimedia" class="block text-900 font-medium mb-2 text-color-primary">Descripción</label>
          <Textarea 
            id="descripcionMultimedia"
            v-model="nuevoMultimedia.descripcion" 
            :autoResize="true" 
            :rows="3" 
            placeholder="Descripción del contenido multimedia"
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label for="archivoMultimedia" class="block text-900 font-medium mb-2 text-color-primary">
            {{ tipoMultimedia === 'imagen' ? 'Seleccionar Imagen' : 'Seleccionar Video' }}
          </label>
          <div class="flex align-items-center gap-3">
            <input 
              type="file" 
              id="archivoMultimedia"
              ref="archivoInput"
              :accept="tipoMultimedia === 'imagen' ? 'image/*' : 'video/*'"
              @change="onArchivoSeleccionado"
              class="hidden"
            />
            <Button 
              label="Seleccionar Archivo" 
              @click="$refs.archivoInput.click()"
              class="p-button-outlined p-button-primary"
            />
            <span v-if="archivoSeleccionado" class="text-sm text-gray-600">
              {{ archivoSeleccionado.name }}
            </span>
          </div>
        </div>

        <!-- Vista previa para imágenes -->
        <div v-if="tipoMultimedia === 'imagen' && vistaPrevia" class="mb-4">
          <label class="block text-900 font-medium mb-2 text-color-primary">Vista Previa</label>
          <div class="text-center">
            <img 
              :src="vistaPrevia" 
              alt="Vista previa"
              class="max-w-full h-32 object-cover border-round border border-gray-200"
            />
          </div>
        </div>

        <!-- Vista previa para videos -->
        <div v-if="tipoMultimedia === 'video' && archivoSeleccionado" class="mb-4">
          <label class="block text-900 font-medium mb-2 text-color-primary">Vista Previa</label>
          <div class="text-center">
            <video 
              v-if="archivoSeleccionado"
              :src="vistaPrevia"
              controls
              class="max-w-full h-32 border-round border border-gray-200"
            >
              Tu navegador no soporta el elemento video.
            </video>
          </div>
        </div>

        <div class="mb-4">
          <label for="fechaMultimedia" class="block text-900 font-medium mb-2 text-color-primary">Fecha</label>
          <Calendar 
            id="fechaMultimedia"
            v-model="nuevoMultimedia.fecha" 
            :showIcon="true"
            dateFormat="dd/mm/yy"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cancelar" 
          @click="cancelarMultimedia"
          class="back-button"
        />
        <Button 
          label="Guardar" 
          @click="guardarMultimedia"
          class="button-primary-custom"
          :disabled="!esFormularioValido"
        />
      </template>
    </Dialog>

    <!-- Modal para Crear Nuevo Informe -->
    <Dialog 
      v-model:visible="modalNuevoInformeVisible" 
      header="Crear Nuevo Informe"
      :style="{ width: '60vw' }" 
      class="p-fluid"
    >
      <div class="flex flex-column w-full gap-3">
        <div class="flex flex-column justify-content-between sm:flex-row gap-4 w-full">
          <div class="w-full">
            <label for="tituloInforme" class="block text-900 font-medium mb-2 text-color-primary">Título del Informe</label>
            <InputText 
              id="tituloInforme"
              v-model="nuevoInforme.titulo" 
              placeholder="Ingrese el título del informe"
              class="w-full"
            />
          </div>
          <div class="">
            <label for="fechaInforme" class="block text-900 font-medium mb-2 text-color-primary">Fecha del Informe</label>
            <DatePicker 
              id="fechaInforme"
              v-model="nuevoInforme.fecha" 
              :showIcon="true"
              dateFormat="dd/mm/yy"
              class="w-full"
            />
          </div>
        </div>
        <div class="">
          <label for="contenidoInforme" class="block text-900 font-medium mb-2 text-color-primary">Contenido del Informe</label>
          <Textarea 
            id="contenidoInforme"
            v-model="nuevoInforme.contenido" 
            :rows="7" 
            placeholder="Escriba el contenido del informe aquí..."
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cancelar" 
          @click="cancelarNuevoInforme"
          class="back-button"
        />
        <Button 
          label="Crear Informe" 
          @click="guardarNuevoInforme"
          class="button-primary-custom"
          :disabled="!esInformeValido"
        />
      </template>
    </Dialog>
  </template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showError, showSuccess } from '@/composables/useToast';
import { usePacienteStore } from '../store';
import { useAuthStore } from '@/modules/auth/store';

const pacienteStore = usePacienteStore();
const route = useRoute();
const router = useRouter();
const tabActivo = ref('Informes');
const rows = ref(5);
const authStore = useAuthStore();

// Estados de los modales
const modalVerVisible = ref(false);
const modalComentarioVisible = ref(false);
const modalMultimediaVisible = ref(false);
const modalNuevoInformeVisible = ref(false);
const informeSeleccionado = ref(null);
const nuevoComentario = ref('');
const tipoMultimedia = ref('imagen');
const archivoSeleccionado = ref(null);
const vistaPrevia = ref(null);
const informes = ref([]);
const comentarios = ref([]);
const comentarioLoading = ref(false);

// Formulario de nuevo multimedia
const nuevoMultimedia = ref({
  titulo: '',
  descripcion: '',
  fecha: new Date()
});

// Formulario de nuevo informe
const nuevoInforme = ref({
  titulo: '',
  contenido: '',
  fecha: new Date()
});

// Estado del tab de historia fisiátrica
const tabHistoriaActivo = ref(0);

// Estado del sub-tab de examen físico
const subTabExamenFisicoActivo = ref(0);

// Tabs de navegación de la historia
const tabsHistoria = ref([
  { id: 1, label: 'Evaluación y Consulta' },
  { id: 2, label: 'Antecedentes' },
  { id: 3, label: 'Anamnesis Sistémica' },
  { id: 4, label: 'Examen Físico' },
  { id: 5, label: 'Diagnóstico Funcional' }
]);

// Sub-tabs de navegación del examen físico
const subTabsExamenFisico = ref([
  { id: 1, label: 'General' },
  { id: 2, label: 'Cabeza y sentidos' },
  { id: 3, label: 'Tronco y extremidades' },
  { id: 4, label: 'Sistema y actividades' }
]);

// Datos de la historia fisiátrica
const historiaFisiatica = ref({
  fechaEvaluacion: '15/06/2025',
  derivadosPor: 'Dolor lumbar crónico, limitación funcional en actividades de la vida diaria. Derivado por traumatólogo Dr. García.',
  antecedentesCuadro: 'Paciente refiere dolor lumbar de 6 meses de evolución, que se agrava con la bipedestación prolongada y la flexión del tronco.',
  medicacionActual: 'Ibuprofeno 600mg cada 8 horas, Paracetamol 500mg según necesidad.',
  estudiosRealizados: 'Radiografía de columna lumbosacra: leve escoliosis. Resonancia magnética: protrusión discal L4-L5.',
  
  // Antecedentes
  antecedentesHereditarios: 'Padre con antecedentes de lumbalgia crónica.',
  antecedentesPatologicos: 'Hipertensión arterial controlada con medicación.',
  antecedentesQuirurgicos: 'Apendicectomía a los 25 años.',
  antecedentesMetabolicos: 'Diabetes tipo 2 controlada con dieta y medicación.',
  antecedentesInmunologicos: 'Sin antecedentes relevantes.',
  
  // Fisiológicos
  fisiologicosDormir: 'Patrón de sueño alterado por el dolor, duerme 5-6 horas por noche.',
  fisiologicosCatarsis: 'Función intestinal normal.',
  fisiologicosPeriodoMenstrual: 'No aplica.',
  fisiologicosAlimentacion: 'Dieta balanceada, sin restricciones especiales.',
  fisiologicosDiuresis: 'Función urinaria normal.',
  fisiologicosSexualidad: 'Sin alteraciones reportadas.',
  
  // Anamnesis sistémica
  anamnesisComunicacion: 'Comunicación verbal normal, sin alteraciones del lenguaje.',
  anamnesisMotricidad: 'Limitación en la flexión del tronco, dolor al levantar objetos pesados.',
  anamnesisVidaDiaria: 'Dificultad para vestirse, calzarse y realizar tareas domésticas que requieren flexión.',
  
  // Examen físico - General
  examenActitud: 'Paciente colaborador, se queja de dolor lumbar.',
  examenComunicacionCodigos: 'Comunicación verbal clara y coherente.',
  examenPielFaneras: 'Piel y faneras normales.',
  
  // Examen físico - Cabeza y sentidos
  examenCabeza: 'Cabeza normocéfala, sin alteraciones.',
  examenMovimientosAnormales: 'Sin movimientos anormales.',
  examenOrejas: 'Orejas normales.',
  
  // Complejo orofacial
  examenBoca: 'Boca normal.',
  examenLengua: 'Lengua normal.',
  examenMordida: 'Mordida normal.',
  examenMaxilares: 'Maxilares normales.',
  
  // Sentidos
  examenOjos: 'Ojos normales, movimientos oculares conservados.',
  examenEstrabismo: 'Sin estrabismo.',
  examenAudicion: 'Audición normal.',
  examenLabios: 'Labios normales.',
  examenDenticion: 'Dentición completa.',
  examenPaladarVelo: 'Paladar y velo normales.',
  
  // Examen físico - Tronco y extremidades
  examenTorax: 'Tórax normal.',
  examenColumnaVertebral: 'Dolor a la palpación en región lumbar, limitación de movimientos.',
  examenCaderas: 'Caderas normales.',
  examenPies: 'Pies normales.',
  examenManos: 'Manos normales.',
  
  // Columna derecha
  examenAbdomen: 'Abdomen blando, no doloroso.',
  examenPelvis: 'Pelvis normal.',
  examenMMII: 'Miembros inferiores normales.',
  examenMMSS: 'Miembros superiores normales.',
  examenLateralidad: 'Diestro.',
  
  // Examen físico - Sistema y actividades
  examenApRespiratorio: 'Aparato respiratorio normal.',
  examenApDigestivo: 'Aparato digestivo normal.',
  examenActividadSensoperceptual: 'Sensibilidad normal.',
  examenDesplazamientoMarcha: 'Marcha normal, sin alteraciones.',
  
  // Columna derecha
  examenApCardiovascular: 'Aparato cardiovascular normal.',
  examenActividadRefleja: 'Reflejos osteotendinosos normales.',
  examenReaccionesPosturales: 'Reacciones posturales normales.',
  examenEtapaDesarrollo: 'Desarrollo normal para la edad.',
  
  // Diagnóstico funcional
  diagnosticoFuncional: 'Lumbalgia crónica mecánica con limitación funcional moderada. Dolor lumbar de origen discal (protrusión L4-L5) con irradiación a miembro inferior derecho.',
  conductaSeguirObjetivos: 'Tratamiento fisiátrico con ejercicios de fortalecimiento de la musculatura lumbar y abdominal. Educación en higiene postural. Control del dolor con técnicas de fisioterapia.',
  objetivosFamilia: 'Apoyo en la realización de ejercicios domiciliarios. Modificación del entorno para evitar posturas que agraven el dolor.'
});

// Datos multimedia de ejemplo
const imagenes = ref([
  {
    id: 1,
    nombre: 'radiografia_lumbar_15062025.jpg',
    fecha: '15/06/2025',
    thumbnail: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Radiografía+Lumbar',
    url: 'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Radiografía+Lumbar+Completa'
  },
  {
    id: 2,
    nombre: 'ejercicio_fisiatrico_18062025.png',
    fecha: '18/06/2025',
    thumbnail: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Ejercicio+Fisiatrico',
    url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Ejercicio+Fisiatrico+Completo'
  }
]);

const videos = ref([
  {
    id: 1,
    nombre: 'video_marcha_20062025.mp4',
    fecha: '20/06/2025',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duracion: '2:30'
  }
]);

// Configuración de tabs
const tabs = ref([
  { label: 'Informes', icon: 'pi pi-file-text' },
  { label: 'Historia Fisiátrica', icon: 'pi pi-history' },
  { label: 'Multimedia', icon: 'pi pi-images' }
]);

// Métodos
const verInforme = async (informe) => {
  comentarioLoading.value = true;
  try{
    comentarios.value = await pacienteStore.obtenerComentarios(informe.hashId);

  }catch(error){
    showError('No es posible obtener los comentarios');
  }finally{
    comentarioLoading.value = false;
  }
  
  // Configurar el informe seleccionado con los datos reales
  informeSeleccionado.value = {
    id: informe.id,
    titulo: informe.titulo,
    profesional: informe.profesional.nombreCompleto,
    fecha: informe.fechaCreacion,
    contenido: informe.contenido,
    tipoInforme: informe.tipoInforme.nombre,
    anexos: informe.anexos || [],
    comentarios: informe.comentarios || []
  };
  
  modalVerVisible.value = true;
};

const agregarComentario = async (informe) => {
  // Configurar el informe seleccionado con los datos reales
  informeSeleccionado.value = {
    id: informe.id,
    titulo: informe.titulo,
    profesional: informe.profesional.nombreCompleto,
    fecha: informe.fechaCreacion,
    contenido: informe.contenido,
    tipoInforme: informe.tipoInforme.nombre,
    comentarios: informe.comentarios || [],
    hashId: informe.hashId
  };

  modalComentarioVisible.value = true;
};

const guardarComentario = async () => {
  if (nuevoComentario.value.trim()) {
    const comentario = {
      idUsuario: authStore.usuario.id_usuario,
      fecha: new Date().toLocaleDateString('es-ES'),
      texto: nuevoComentario.value.trim()
    };

    try{
      await pacienteStore.crearComentario(comentario, informeSeleccionado.value.hashId);
      
      comentarios.value = await pacienteStore.obtenerComentarios(informeSeleccionado.value.hashId);
      showSuccess('Comentario agregado correctamente');
      nuevoComentario.value = '';
      modalComentarioVisible.value = false;
    }catch(error){
      showError('No es posible agregar el comentario');
    }
  }
};

// Funciones para multimedia
const agregarImagen = () => {
  tipoMultimedia.value = 'imagen';
  limpiarFormularioMultimedia();
  modalMultimediaVisible.value = true;
};

const agregarVideo = () => {
  tipoMultimedia.value = 'video';
  limpiarFormularioMultimedia();
  modalMultimediaVisible.value = true;
};

const limpiarFormularioMultimedia = () => {
  nuevoMultimedia.value = {
    titulo: '',
    descripcion: '',
    fecha: new Date()
  };
  archivoSeleccionado.value = null;
  vistaPrevia.value = null;
};

const onArchivoSeleccionado = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    archivoSeleccionado.value = archivo;
    
    // Crear vista previa
    if (tipoMultimedia.value === 'imagen') {
      const reader = new FileReader();
      reader.onload = (e) => {
        vistaPrevia.value = e.target.result;
      };
      reader.readAsDataURL(archivo);
    } else if (tipoMultimedia.value === 'video') {
      const reader = new FileReader();
      reader.onload = (e) => {
        vistaPrevia.value = e.target.result;
      };
      reader.readAsDataURL(archivo);
    }
  }
};

const cancelarMultimedia = () => {
  modalMultimediaVisible.value = false;
  limpiarFormularioMultimedia();
};

const guardarMultimedia = () => {
  if (esFormularioValido.value) {
    // Aquí implementarías la lógica para guardar en tu API
    const multimedia = {
      id: Date.now(), // ID temporal
      titulo: nuevoMultimedia.value.titulo,
      descripcion: nuevoMultimedia.value.descripcion,
      fecha: nuevoMultimedia.value.fecha,
      archivo: archivoSeleccionado.value,
      tipo: tipoMultimedia.value
    };
    
    if (tipoMultimedia.value === 'imagen') {
      // Agregar a la lista de imágenes
      imagenes.value.push({
        id: multimedia.id,
        nombre: multimedia.archivo.name,
        fecha: formatearFecha(multimedia.fecha),
        thumbnail: vistaPrevia.value,
        url: vistaPrevia.value
      });
      showSuccess('Imagen agregada correctamente');
    } else {
      // Agregar a la lista de videos
      videos.value.push({
        id: multimedia.id,
        nombre: multimedia.archivo.name,
        fecha: formatearFecha(multimedia.fecha),
        url: vistaPrevia.value,
        duracion: '0:00' // Aquí podrías calcular la duración real
      });
      showSuccess('Video agregado correctamente');
    }
    
    modalMultimediaVisible.value = false;
    limpiarFormularioMultimedia();
  }
};

const verImagen = (imagen) => {
  showSuccess(`Abriendo imagen: ${imagen.nombre}`);
  // Aquí implementarías la lógica para ver la imagen completa
  // Podrías abrir un modal con la imagen en tamaño completo
};

const verVideo = (video) => {
  showSuccess(`Reproduciendo video: ${video.nombre}`);
  // Aquí implementarías la lógica para reproducir el video
  // Podrías abrir un modal con un reproductor de video
};

const volverALista = () => {
  router.push('/pacientes');
};

// Función para crear nueva historia fisiátrica
const crearNuevaHistoria = () => {
  router.push(`/pacientes/${route.params.id}/nueva-historia`);
};

// Funciones para nuevo informe
const crearNuevoInforme = () => {
  limpiarFormularioInforme();
  modalNuevoInformeVisible.value = true;
};

const limpiarFormularioInforme = () => {
  nuevoInforme.value = {
    titulo: '',
    contenido: '',
    fecha: new Date()
  };
};

const cancelarNuevoInforme = () => {
  modalNuevoInformeVisible.value = false;
  limpiarFormularioInforme();
};

const guardarNuevoInforme = async () => {

  const user = authStore.usuario;

  if (esInformeValido.value) {

    const informe = {
      idUsuario: user.id_usuario,
      titulo: nuevoInforme.value.titulo,
      contenido: nuevoInforme.value.contenido,
      fecha: formatearFecha(nuevoInforme.value.fecha),
      dniPaciente: pacienteStore.paciente.dni,
    };

    try {
      await pacienteStore.crearInforme(informe);

      showSuccess('Informe creado correctamente');
      modalNuevoInformeVisible.value = false;
      limpiarFormularioInforme();
      
      // Refrescar la lista de informes
      informes.value = await pacienteStore.obtenerInformes(pacienteStore.paciente.hashId);
    } catch (error) {
      showError('No es posible crear el informe');
    }
  }
};

// Computed properties
const esFormularioValido = computed(() => {
  return nuevoMultimedia.value.titulo.trim() && 
         archivoSeleccionado.value && 
         nuevoMultimedia.value.fecha;
});

const esInformeValido = computed(() => {
  return nuevoInforme.value.titulo.trim() && 
         nuevoInforme.value.contenido.trim() && 
         nuevoInforme.value.fecha;
});

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

onMounted(async () => {
  try{
    pacienteStore.paciente = await pacienteStore.obtenerPaciente(route.params.id);
    informes.value = await pacienteStore.obtenerInformes(pacienteStore.paciente.hashId);
  }catch(error){
    showError('No es posible obtener el paciente');
  }
});
</script>

<style scoped>
.text-color-primary{
  color: #7c3aed;
}

.informe-bg {
  background-color: #f8f7ff;
}

/* Fondo de la página */
.page-container {
  background-color: #f8f7ff;
  min-height: 100vh;
}

/* Botón de volver con el mismo color de borde que Agregar Paciente */
.back-button {
  background-color: white !important;
  border-color: #8b5cf6 !important;
  color: #8b5cf6 !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  color: #ffffff !important;
}

/* Estilos personalizados para mejorar la apariencia */
:deep(.p-tabs) {
  border: none;
}

:deep(.p-tabs-nav) {
  border-bottom: 2px solid #e5e7eb;
  background: transparent;
}

:deep(.p-tabs-nav-link) {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  padding: 1rem 1.5rem;
  transition: all 0.2s ease;
}

:deep(.p-tabs-nav-link:hover) {
  background: #f3f4f6;
  color: #7c3aed;
}

:deep(.p-tabs-nav-link.p-highlight) {
  background: #f3f4f6;
  color: #7c3aed;
  border-bottom: 2px solid #7c3aed;
}

:deep(.p-tabs-panels) {
  padding: 0;
  background: transparent;
}

:deep(.p-tabs-panel) {
  padding: 0;
}

/* Estilos para el avatar personalizado */
:deep(.p-avatar) {
  background: #7c3aed !important;
  box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.1), 0 2px 4px -1px rgba(124, 58, 237, 0.06);
}

/* Estilos para los botones */
:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.p-button-primary) {
  background: #7c3aed !important;
  border-color: #7c3aed !important;
  color: white !important;
}

.button-primary-custom{
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
  color: white !important;
}

:deep(.p-button-primary:hover) {
  background-color: #6d28d9 !important;
  border-color: #6d28d9 !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.2);
}

:deep(.p-button-outlined.p-button-primary) {
  background-color: white !important;
  color: #7c3aed !important;
  border-color: #7c3aed !important;
}

:deep(.p-button-outlined.p-button-primary:hover) {
  background-color: #7c3aed  !important;
  color: white !important;
}

/* Estilos para los textareas */
:deep(.p-inputtextarea) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: border-color 0.2s ease;
}

:deep(.p-inputtextarea:focus) {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .p-4 {
    padding: 1rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
}

/* Estilos para los modales */
:deep(.p-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.p-dialog-header) {
  background: #f8f7ff !important;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px 12px 0 0;
  color: #7c3aed !important;
}

:deep(.p-dialog-content) {
  padding: 0;
  background: white;
}

:deep(.p-dialog-footer) {
  background: #f8f7ff !important;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  padding: 1rem 1.5rem;
}

:deep(.p-dialog-title) {
  color: #7c3aed !important;
  font-weight: 600;
}

/* Estilos para multimedia */
:deep(.p-button-text.p-button-link) {
  color: #7c3aed !important;
  text-decoration: none !important;
}

:deep(.p-button-text.p-button-link:hover) {
  color: #6d28d9 !important;
  text-decoration: underline !important;
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

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Estilos para el modal de multimedia */
.hidden {
  display: none;
}

.max-w-full {
  max-width: 100%;
}

.h-32 {
  height: 8rem;
}

/* Estilos para el tab de historia fisiátrica */
.md\:col-span-2 {
  grid-column: span 2 / span 2;
}

.block {
  display: block;
}

.text-900 {
  color: #111827;
}

.font-medium {
  font-weight: 500;
}

.space-y-4 > * + * {
  margin-top: 1rem;
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
</style>
