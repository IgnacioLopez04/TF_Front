<template>
  <div class="page-container p-4 border-round">
    <!-- Header principal -->
    <div class="bg-white border-round-xl shadow-sm border border-gray-100 p-5 mb-4">
      <div class="flex justify-content-between align-items-center ">
        <div>
          <h1 class="text-2xl font-bold text-color-primary mb-2">Nueva Historia Fisiátrica</h1>
          <p class="text-gray-600 text-lg">Paciente: {{ `${pacienteStore.paciente.nombre} ${pacienteStore.paciente.apellido}` }} (DNI: {{ pacienteStore.paciente.dni }})</p>
        </div>
      </div>
    </div>
         <!-- Navegación de pasos personalizada -->
     <div class="bg-white border-round-xl shadow-sm border border-gray-100 p-4 mb-4">
       <div class="timeline-container">
         <div 
           v-for="(paso, index) in pasos" 
           :key="paso.id"
           class="timeline-step"
           :class="{ 'active': paso.numero <= (pasoActivo + 1) }"
           @click="seleccionarPaso(index)"
         >
           <div class="step-circle">
             {{ paso.numero }}
           </div>
           <span class="step-label">
             {{ paso.titulo }}
           </span>
           <div 
             v-if="index < pasos.length - 1"
             class="step-connector"
             :class="{ 'active': paso.numero < (pasoActivo + 1) }"
           ></div>
         </div>
       </div>
     </div>
    <!-- Contenido del paso activo -->
    <div class="bg-white border-round-xl shadow-sm border border-gray-100 p-6">
      <!-- Paso 1: Evaluación y Consulta -->
      <div v-if="pasoActivo === 0">
        <div class="flex flex-column">
          <!-- Fecha de Evaluación -->
          <div class="flex justify-content-between align-items-center md:flex-row flex-column">
            <h2 class="text-xl font-semibold mb-4 text-color-primary">Información de la Evaluación</h2>
            <div class="flex align-items-center gap-2 md:flex-row flex-column">
              <label class="block font-medium ">
                Fecha de Evaluación <span class="text-red-500">*</span>
              </label>
              <Calendar 
                v-model="pacienteStore.historiaFisiatrica.fechaEvaluacion"
                @onChange="onChangeFechaEvaluacion"
                :showIcon="true"
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
          <Divider />
          <!-- Consulta -->
          <div class="md:col-span-2">
            <label class="block font-bold mb-2 text-color-primary text-xl">
              Consulta
            </label>
            <div class="mb-4">
              <label class="block font-medium mb-2">
                Derivados por <span class="text-red-500">*</span>
              </label>
              <Textarea 
                v-model="pacienteStore.historiaFisiatrica.derivadosPor" 
                :autoResize="true" 
                :rows="4" 
                placeholder="Describa el motivo principal de la consulta..."
                class="w-full"
              />
            </div>
          </div>
          <!-- Antecedentes del cuadro actual -->
          <div class="md:col-span-2 mb-4">
            <label class="block text-900 font-medium mb-2 text-color-primary">
              Antecedentes del cuadro actual
            </label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.antecedentesCuadro" 
              :autoResize="true" 
              :rows="4" 
              placeholder="Describa los antecedentes relevantes..."
              class="w-full"
            />
          </div>
          
          <!-- Medicación actual -->
          <div class="md:col-span-2 mb-4">
            <label class="block text-900 font-medium mb-2 text-color-primary">
              Medicación actual
            </label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.medicacionActual" 
              :autoResize="true" 
              :rows="4" 
              placeholder="Describa la medicación que toma actualmente..."
              class="w-full"
            />
          </div>
          
          <!-- Estudios realizados -->
          <div class="md:col-span-2">
            <label class="block text-900 font-medium mb-2 text-color-primary">
              Estudios realizados
            </label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.estudiosRealizados" 
              :autoResize="true" 
              :rows="4" 
              placeholder="Liste los estudios realizados..."
              class="w-full"
            />
          </div>
        </div>
      </div>

             <!-- Paso 2: Antecedentes -->
       <div v-else-if="pasoActivo === 1">
         <h2 class="text-xl font-semibold mb-4 text-color-primary">Antecedentes</h2>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <!-- Hereditarios -->
           <div>
             <label class="block text-900 font-medium mb-2 text-color-primary">Hereditarios</label>
             <Textarea 
               v-model="pacienteStore.historiaFisiatrica.antecedentesHereditarios" 
               :autoResize="true" 
               :rows="3" 
               placeholder="Describa los antecedentes hereditarios relevantes..."
               class="w-full"
             />
           </div>
           
           <!-- Patológicos -->
           <div>
             <label class="block text-900 font-medium mb-2 text-color-primary">Patológico</label>
             <Textarea 
               v-model="pacienteStore.historiaFisiatrica.antecedentesPatologicos" 
               :autoResize="true" 
               :rows="3" 
               placeholder="Describa los antecedentes patológicos relevantes..."
               class="w-full"
             />
           </div>
           
           <!-- Quirúrgicos -->
           <div>
             <label class="block text-900 font-medium mb-2 text-color-primary">Quirúrgicos</label>
             <Textarea 
               v-model="pacienteStore.historiaFisiatrica.antecedentesQuirurgicos" 
               :autoResize="true" 
               :rows="3" 
               placeholder="Describa los antecedentes quirúrgicos relevantes..."
               class="w-full"
             />
           </div>
           
           <!-- Metabólicos -->
           <div>
             <label class="block text-900 font-medium mb-2 text-color-primary">Metabólicos</label>
             <Textarea 
               v-model="pacienteStore.historiaFisiatrica.antecedentesMetabolicos" 
               :autoResize="true" 
               :rows="3" 
               placeholder="Describa los antecedentes metabólicos relevantes..."
               class="w-full"
             />
           </div>
           
           <!-- Inmunológicos -->
           <div>
             <label class="block text-900 font-medium mb-2 text-color-primary">Inmunológicos</label>
             <Textarea 
               v-model="pacienteStore.historiaFisiatrica.antecedentesInmunologicos" 
               :autoResize="true" 
               :rows="3" 
               placeholder="Describa los antecedentes inmunológicos relevantes..."
               class="w-full"
             />
           </div>
         </div>

         <!-- Sección Fisiológicos separada -->
         <Divider class="my-4" />
         
         <div class="mb-4">
           <h3 class="font-semibold text-color-primary mb-3">Fisiológicos</h3>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <!-- Columna izquierda -->
             <div class="space-y-4">
               <div>
                 <label class="block text-md font-medium text-700 mb-2">Dormir</label>
                 <Textarea 
                   v-model="pacienteStore.historiaFisiatrica.fisiologicosDormir" 
                   :autoResize="true" 
                   :rows="2" 
                   placeholder="Describa el patrón de sueño..."
                   class="w-full"
                 />
               </div>
               
               <div>
                 <label class="block text-md font-medium text-700 mb-2">Catarsis</label>
                 <Textarea 
                   v-model="pacienteStore.historiaFisiatrica.fisiologicosCatarsis" 
                   :autoResize="true" 
                   :rows="2" 
                   placeholder="Describa el patrón intestinal..."
                   class="w-full"
                 />
               </div>
               
               <div>
                 <label class="block text-md font-medium text-700 mb-2">Periodo menstrual</label>
                 <Textarea 
                   v-model="pacienteStore.historiaFisiatrica.fisiologicosPeriodoMenstrual" 
                   :autoResize="true" 
                   :rows="2" 
                   placeholder="Describa el patrón menstrual..."
                   class="w-full"
                 />
               </div>
             </div>
             
             <!-- Columna derecha -->
             <div class="space-y-4">
               <div>
                 <label class="block text-md font-medium text-700 mb-2">Alimentación</label>
                 <Textarea 
                   v-model="pacienteStore.historiaFisiatrica.fisiologicosAlimentacion" 
                   :autoResize="true" 
                   :rows="2" 
                   placeholder="Describa los hábitos alimentarios..."
                   class="w-full"
                 />
               </div>
               
               <div>
                 <label class="block text-md font-medium text-700 mb-2">Diuresis</label>
                 <Textarea 
                   v-model="pacienteStore.historiaFisiatrica.fisiologicosDiuresis" 
                   :autoResize="true" 
                   :rows="2" 
                   placeholder="Describa el patrón urinario..."
                   class="w-full"
                 />
               </div>
               
               <div>
                 <label class="block text-md font-medium text-700 mb-2">Sexualidad</label>
                 <Textarea 
                   v-model="pacienteStore.historiaFisiatrica.fisiologicosSexualidad" 
                   :autoResize="true" 
                   :rows="2" 
                   placeholder="Describa aspectos relevantes..."
                   class="w-full"
                 />
               </div>
             </div>
           </div>
         </div>
       </div>

      <!-- Paso 3: Anamnesis Sistémica -->
      <div v-else-if="pasoActivo === 2">
        <h2 class="text-xl font-semibold mb-4 text-color-primary">Anamnesis Sistémica</h2>
        
        <div class="grid grid-cols-1 gap-4">
          <!-- Capacidades de comunicación -->
          <div>
            <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades de comunicación</label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.anamnesisComunicacion" 
              :autoResize="true" 
              :rows="3" 
              placeholder="Describa las capacidades de comunicación..."
              class="w-full"
            />
          </div>
          
          <!-- Capacidades en motricidad -->
          <div>
            <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades en motricidad</label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.anamnesisMotricidad" 
              :autoResize="true" 
              :rows="3" 
              placeholder="Describa las capacidades motrices..."
              class="w-full"
            />
          </div>
          
          <!-- Capacidades de la vida diaria -->
          <div>
            <label class="block text-900 font-medium mb-2 text-color-primary">Capacidades de la vida diaria</label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.anamnesisVidaDiaria" 
              :autoResize="true" 
              :rows="3" 
              placeholder="Describa las capacidades para actividades diarias..."
              class="w-full"
            />
          </div>
        </div>
      </div>

             <!-- Paso 4: Examen Físico -->
       <div v-else-if="pasoActivo === 3">
         <h2 class="text-xl font-semibold mb-4 text-color-primary">Examen Físico</h2>
         
         <!-- Sub-tabs del examen físico -->
         <div class="bg-gray-50 border-round-xl p-4 mb-4">
           <div class="flex border-bottom-1 border-gray-200 mb-4">
             <button 
               v-for="(subTab, index) in subTabsExamenFisico" 
               :key="subTab.id"
               @click="subTabExamenFisicoActivo = index"
               :class="[
                 'flex-1 p-3 text-center border-none cursor-pointer transition-all duration-200',
                 subTabExamenFisicoActivo === index 
                   ? 'bg-white text-color-primary border-bottom-2 border-color-primary' 
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               ]"
             >
               {{ subTab.label }}
             </button>
           </div>
           
           <!-- Contenido de los sub-tabs -->
           <div class="p-4">
             <!-- Sub-tab General -->
             <div v-if="subTabExamenFisicoActivo === 0">
               <h5 class="text-lg font-semibold mb-4 text-color-primary">General</h5>
               <div class="grid grid-cols-1 gap-4">
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Actitud</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenActitud" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa la actitud del paciente..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Comunicación y códigos</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenComunicacionCodigos" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa la comunicación..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Piel y faneras</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenPielFaneras" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado de la piel..."
                     class="w-full"
                   />
                 </div>
               </div>
             </div>
             
                           <!-- Sub-tab Cabeza y sentidos -->
              <div v-else-if="subTabExamenFisicoActivo === 1">
                <h5 class="text-lg font-semibold mb-4 text-color-primary">Cabeza y sentidos</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Cabeza</label>
                    <Textarea 
                      v-model="pacienteStore.historiaFisiatrica.examenCabeza" 
                      :autoResize="true" 
                      :rows="2" 
                      placeholder="Describa el estado de la cabeza..."
                      class="w-full"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Ojos</label>
                    <Textarea 
                      v-model="pacienteStore.historiaFisiatrica.examenOjos" 
                      :autoResize="true" 
                      :rows="2" 
                      placeholder="Describa el estado de los ojos..."
                      class="w-full"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Movimientos anormales</label>
                    <Textarea 
                      v-model="pacienteStore.historiaFisiatrica.examenMovimientosAnormales" 
                      :autoResize="true" 
                      :rows="2" 
                      placeholder="Describa movimientos anormales..."
                      class="w-full"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Estrabismo</label>
                    <Textarea 
                      v-model="pacienteStore.historiaFisiatrica.examenEstrabismo" 
                      :autoResize="true" 
                      :rows="2" 
                      placeholder="Describa si hay estrabismo..."
                      class="w-full"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Orejas</label>
                    <Textarea 
                      v-model="pacienteStore.historiaFisiatrica.examenOrejas" 
                      :autoResize="true" 
                      :rows="2" 
                      placeholder="Describa el estado de las orejas..."
                      class="w-full"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-900 font-medium mb-2 text-color-primary">Audición</label>
                    <Textarea 
                      v-model="pacienteStore.historiaFisiatrica.examenAudicion" 
                      :autoResize="true" 
                      :rows="2" 
                      placeholder="Describa la capacidad auditiva..."
                      class="w-full"
                    />
                  </div>
                </div>

                <!-- Sub-tab Complejo orofacial -->
                <Divider class="my-4" />
                <div class="bg-gray-50 border-round-xl p-4 mb-4">
                  <h6 class="text-lg font-semibold mb-4 text-color-primary">Complejo orofacial</h6>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Boca</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenBoca" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el estado de la boca..."
                        class="w-full"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Labios</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenLabios" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el estado de los labios..."
                        class="w-full"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Lengua</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenLengua" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el estado de la lengua..."
                        class="w-full"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Dentición</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenDenticion" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el estado de la dentición..."
                        class="w-full"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Mordida</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenMordida" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el tipo de mordida..."
                        class="w-full"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-900 font-medium mb-2 text-color-primary">Paladar y velo</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenPaladarVelo" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el paladar y velo..."
                        class="w-full"
                      />
                    </div>
                    
                    <div class="md:col-span-2">
                      <label class="block text-900 font-medium mb-2 text-color-primary">Maxilares</label>
                      <Textarea 
                        v-model="pacienteStore.historiaFisiatrica.examenMaxilares" 
                        :autoResize="true" 
                        :rows="2" 
                        placeholder="Describa el estado de los maxilares..."
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
             
             <!-- Sub-tab Tronco y extremidades -->
             <div v-else-if="subTabExamenFisicoActivo === 2">
               <h5 class="text-lg font-semibold mb-4 text-color-primary">Tronco y extremidades</h5>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Tórax</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenTorax" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado del tórax..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Abdomen</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenAbdomen" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado del abdomen..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Columna vertebral</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenColumnaVertebral" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado de la columna..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Pelvis</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenPelvis" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado de la pelvis..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Caderas</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenCaderas" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado de las caderas..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">M.M.I.I.</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenMmii" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa miembros inferiores..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Pies</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenPies" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado de los pies..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">M.M.S.S.</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenMmss" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa miembros superiores..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Manos</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenManos" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el estado de las manos..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Lateralidad</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenLateralidad" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa la lateralidad..."
                     class="w-full"
                   />
                 </div>
               </div>
             </div>
             
             <!-- Sub-tab Sistema y actividades -->
             <div v-else-if="subTabExamenFisicoActivo === 3">
               <h5 class="text-lg font-semibold mb-4 text-color-primary">Sistema y actividades</h5>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Respiratorio</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenApRespiratorio" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el aparato respiratorio..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Cardiovascular</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenApCardiovascular" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el aparato cardiovascular..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Ap. Digestivo</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenApDigestivo" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el aparato digestivo..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Actividad refleja</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenActividadRefleja" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa la actividad refleja..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Actividad sensoperceptual</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenActividadSensoperceptual" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa la actividad sensoperceptual..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Reacciones posturales</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenReaccionesPosturales" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa las reacciones posturales..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Desplazamiento-marcha</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenDesplazamientoMarcha" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa el desplazamiento y marcha..."
                     class="w-full"
                   />
                 </div>
                 
                 <div>
                   <label class="block text-900 font-medium mb-2 text-color-primary">Etapa del desarrollo</label>
                   <Textarea 
                     v-model="pacienteStore.historiaFisiatrica.examenEtapaDesarrollo" 
                     :autoResize="true" 
                     :rows="2" 
                     placeholder="Describa la etapa del desarrollo..."
                     class="w-full"
                   />
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

      <!-- Paso 5: Diagnóstico Funcional -->
      <div v-else-if="pasoActivo === 4">
        <h2 class="text-xl font-semibold mb-4 text-color-primary">Diagnóstico Funcional</h2>
        
        <div class="grid grid-cols-1 gap-4">
          <!-- Diagnóstico Funcional -->
          <div>
            <label class="block text-900 font-medium mb-2 text-color-primary">Diagnóstico Funcional</label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.diagnosticoFuncional" 
              :autoResize="true" 
              :rows="4" 
              placeholder="Describa el diagnóstico funcional..."
              class="w-full"
            />
          </div>
          
          <!-- Conducta a seguir, objetivos -->
          <div>
            <label class="block text-900 font-medium mb-2 text-color-primary">Conducta a seguir, objetivos</label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.conductaSeguirObjetivos" 
              :autoResize="true" 
              :rows="4" 
              placeholder="Describa la conducta a seguir y objetivos..."
              class="w-full"
            />
          </div>
          
          <!-- Objetivos de la familia -->
          <div>
            <label class="block text-900 font-medium mb-2 text-color-primary">Objetivos de la familia</label>
            <Textarea 
              v-model="pacienteStore.historiaFisiatrica.objetivosFamilia" 
              :autoResize="true" 
              :rows="4" 
              placeholder="Describa los objetivos de la familia..."
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de navegación -->
    <div class="flex justify-content-between mt-6">
      <Button 
        v-if="pasoActivo > 0"
        label="Anterior" 
        icon="pi pi-arrow-left"
        iconPos="left"
        @click="pasoAnterior"
        class="back-button border-round"
      />
      
      <div v-else></div>
      
      <div class="flex gap-2">
        <Button 
          label="X Cancelar" 
          @click="cancelar"
          class="back-button border-round"
        />
        
        <Button 
          v-if="pasoActivo < pasos.length - 1"
          label="Siguiente" 
          icon="pi pi-arrow-right"
          @click="pasoSiguiente"
          iconPos="right"
          class="button-primary-custom border-round"
        />
        
        <Button 
          v-else
          label="Finalizar" 
          icon="pi pi-check"
          @click="finalizarHistoria"
          class="button-primary-custom border-round"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccess, showError } from '@/composables/useToast';
import { usePacienteStore } from '../store';

// Props y emits
const props = defineProps({
  pacienteId: {
    type: [String, Number],
    required: true
  }
});
// Router
const router = useRouter();

// Estado del formulario
const pacienteStore = usePacienteStore();
const pasoActivo = ref(0);
const subTabExamenFisicoActivo = ref(0);

// Inicializar la historia fisiatrica cuando se monta el componente
onMounted(() => {
  pacienteStore.inicializarHistoriaFisiatrica();
  pacienteStore.historiaFisiatrica.fechaEvaluacion = new Date();
});

// Pasos de la historia
const pasos = ref([
  { numero: 1, titulo: 'Evaluación y Consulta' },
  { numero: 2, titulo: 'Antecedentes' },
  { numero: 3, titulo: 'Anamnesis Sistémica' },
  { numero: 4, titulo: 'Examen Físico' },
  { numero: 5, titulo: 'Diagnóstico Funcional' }
]);

// Sub-tabs del examen físico
const subTabsExamenFisico = ref([
  { id: 1, label: 'General' },
  { id: 2, label: 'Cabeza y sentidos' },
  { id: 3, label: 'Tronco y extremidades' },
  { id: 4, label: 'Sistema y actividades' }
]);

// Computed properties
const esFormularioValido = computed(() => {
  if (pasoActivo.value === 0) {
    return pacienteStore.historiaFisiatrica.fechaEvaluacion && 
           pacienteStore.historiaFisiatrica.derivadosPor.trim().length > 0;
  }
  return true;
});

// Formatear fecha de evaluación a formato legible DD/MM/YYYY
const fechaEvaluacionFormateada = computed(() => {
  if (
    !pacienteStore.historiaFisiatrica.fechaEvaluacion ||
    pacienteStore.historiaFisiatrica.fechaEvaluacion === 'Sin información'
  )
    return 'Sin información';

  // Ajustar a UTC-3 (Argentina, por ejemplo)
  const fechaOriginal = new Date(pacienteStore.historiaFisiatrica.fechaEvaluacion);
  // Obtener la hora UTC y restar 3 horas para UTC-3
  const fechaUTC3 = new Date(fechaOriginal.getTime() - 3 * 60 * 60 * 1000);

  const dia = fechaUTC3.getDate().toString().padStart(2, '0');
  const mes = (fechaUTC3.getMonth() + 1).toString().padStart(2, '0');
  const año = fechaUTC3.getFullYear();

  return `${dia}/${mes}/${año}`;
});

// Métodos  
const seleccionarPaso = (index) => {
  // Solo permitir ir a pasos ya completados o al siguiente disponible
  if (index <= pasoActivo.value || index === 0) {
    pasoActivo.value = index;
  }
};

const pasoAnterior = () => {
  if (pasoActivo.value > 0) {
    pasoActivo.value--;
  }
};

const pasoSiguiente = () => {
  if (esFormularioValido.value && pasoActivo.value < pasos.value.length - 1) {
    pasoActivo.value++;
  } else if (!esFormularioValido.value) {
    showError('Por favor complete los campos obligatorios antes de continuar');
  }
};

const cancelar = () => {
  if (confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.')) {
    volver();
  }
};

const onChangeFechaEvaluacion = () => {
  // La fecha ya se actualiza automáticamente en el v-model
  // El computed fechaEvaluacionFormateada se recalculará automáticamente
};

const finalizarHistoria = () => {
  if (esFormularioValido.value) {
    pacienteStore.crearHistoriaFisiatrica(pacienteStore.historiaFisiatrica);
    showSuccess('Historia fisiátrica creada exitosamente');
    router.push(`/pacientes/${pacienteStore.paciente.hashId}`);
  } else {
    showError('Por favor complete todos los campos obligatorios');
  }
};

const volver = () => {
  pacienteStore.inicializarHistoriaFisiatrica();
  router.push(`/pacientes/${pacienteStore.paciente.hashId}`);
};
</script>

<style scoped>
/* Estilos específicos para esta vista */
.page-container {
  background-color: #f8f7ff;
  min-height: 100vh;
}

.text-color-primary {
  color: #7c3aed;
}

.bg-color-primary {
  background-color: #7c3aed;
}

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

.button-primary-custom {
  background-color: #7c3aed;
  border-color: #7c3aed;
  color: white;
}

.button-primary-custom:hover {
  background-color: white;
  border-color: #7c3aed;
  color: #7c3aed;
}

/* Estilos para el grid responsivo */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

/* Estilos para flexbox */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

/* Espaciado */
.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

/* Tamaños */
.w-3rem {
  width: 3rem;
}

.h-3rem {
  height: 3rem;
}

.w-4rem {
  width: 4rem;
}

.h-1 {
  height: 0.25rem;
}

.w-8rem {
  width: 8rem;
}

.w-full {
  width: 100%;
}

/* Colores de texto */
.text-white {
  color: white;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.text-red-500 {
  color: #ef4444;
}

/* Colores de fondo */
.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-gray-300 {
  background-color: #d1d5db;
}

/* Bordes */
.border-bottom-1 {
  border-bottom-width: 1px;
}

.border-bottom-2 {
  border-bottom-width: 2px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

/* Transiciones */
.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

/* Hover */
.hover\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

/* Responsive */
@media (min-width: 768px) {
  .md\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}

/* Estilos para el timeline personalizado */
.timeline-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 0;
}

.timeline-step {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.timeline-step:hover {
  transform: translateY(-2px);
}

.step-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.timeline-step.active .step-circle {
  background-color: #7c3aed;
  color: white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.timeline-step:not(.active) .step-circle {
  background-color: #d1d5db;
  color: #6b7280;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.timeline-step.active .step-label {
  color: #7c3aed;
  font-weight: 600;
}

.step-connector {
  width: 2rem;
  height: 0.125rem;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
}

.step-connector.active {
  background-color: #7c3aed;
}

.step-connector:not(.active) {
  background-color: #e5e7eb;
}

/* Responsive para pantallas pequeñas */
@media (max-width: 640px) {
  .timeline-container {
    gap: 0.5rem;
  }
  
  .step-label {
    display: none;
  }
  
  .step-connector {
    width: 1.5rem;
    margin: 0 0.25rem;
  }
}

/* Estilos adicionales para la pantalla de Antecedentes */
.space-y-4 > div + div {
  margin-top: 1rem;
}

/* Estilos para el divider */
:deep(.p-divider) {
  border-color: #e5e7eb;
}

:deep(.p-divider.p-divider-horizontal) {
  margin: 1.5rem 0;
}

/* Estilos para los campos de fisiológicos */
.fisiologicos-section h3 {
  color: #374151;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.fisiologicos-section label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
