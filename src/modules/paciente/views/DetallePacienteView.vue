<template>
  <div class="page-container p-4 border-round">
    <div v-if="cargandoPaciente" class="flex flex-column justify-content-center align-items-center" style="height: 60vh;">
      <ProgressSpinner />
      <p class="mt-3 text-gray-500">Cargando datos del paciente...</p>
    </div>
    <template v-else>
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
          <div v-if="!verHistorialActivo" class="p-4">
            <div v-if="!crearHistoriaFisiatrica" class="flex justify-content-end gap-2 mb-3">
              <Button
                label="Editar historia"
                icon="pi pi-pencil"
                @click="editarHistoria"
                class="p-button-outlined p-button-primary"
              />
              <Button
                label="Ver historial"
                icon="pi pi-history"
                @click="abrirHistorial"
                class="p-button-outlined p-button-primary"
              />
            </div>
            <HistoriaFisiatrica :crearHistoriaFisiatrica="crearHistoriaFisiatrica" />
          </div>
          <div v-else class="p-4">
            <div class="flex justify-content-between align-items-center mb-4">
              <h3 class="text-xl font-bold text-color-primary">Historial de versiones</h3>
              <Button
                label="Cerrar historial"
                icon="pi pi-times"
                @click="cerrarHistorial"
                class="p-button-text p-button-secondary"
              />
            </div>
            <div v-if="cargandoHistorial" class="flex justify-content-center p-4">
              <ProgressSpinner />
            </div>
            <div v-else-if="versionSeleccionada" class="bg-white border-round-xl shadow-sm border border-gray-100 p-4">
              <div class="flex justify-content-between align-items-center mb-4">
                <h4 class="text-lg font-semibold text-color-primary">Versión {{ getVersionMeta(versionSeleccionada).version_number }}</h4>
                <Button
                  label="Volver al historial"
                  icon="pi pi-arrow-left"
                  @click="versionSeleccionada = null"
                  class="p-button-outlined p-button-primary"
                />
              </div>
              <HistoriaFisiatrica
                :crear-historia-fisiatrica="false"
                :historia-para-mostrar="historiaDesdeVersionSeleccionada"
              />
            </div>
            <div v-else-if="pacienteStore.historialHistoriaFisiatrica.length === 0" class="text-center p-6 text-gray-600">
              No hay versiones en el historial.
            </div>
            <div v-else class="flex flex-column gap-2">
              <div
                v-for="recurso in pacienteStore.historialHistoriaFisiatrica"
                :key="recurso.id"
                class="bg-white border-round-xl p-3 shadow-sm border border-gray-100 flex align-items-center justify-content-between cursor-pointer hover:bg-gray-50"
                @click="versionSeleccionada = recurso"
              >
                <span class="font-semibold text-color-primary">Versión {{ getVersionMeta(recurso).version_number }}</span>
                <span class="text-gray-600">{{ formatearFechaHistorial(getVersionMeta(recurso).effective_from) }}</span>
                <Tag v-if="getVersionMeta(recurso).is_current" value="Actual" severity="success" />
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
            <div class="mb-6" v-if="imagenes.length > 0">
              <h4 class="text-lg font-semibold mb-3 text-color-primary">Imágenes</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="imagen in imagenes" 
                  :key="imagen.id"
                  class="bg-white border-round-xl p-3 shadow-md"
                >
                  <div class="text-center mb-3 position-relative" style="min-height: 128px;">
                    <div v-if="imagen.thumbnail && !imagen.error" class="w-full h-32 border-round overflow-hidden position-relative">
                      <img 
                        :src="imagen.thumbnail" 
                        :alt="imagen.titulo || imagen.nombre"
                        class="w-full h-32 object-cover border-round"
                        @click="verImagen(imagen)"
                        @load="imagen.loading = false"
                        @error="handlePreviewImageError(imagen)"
                        style="cursor: pointer;"
                      />
                      <div v-if="imagen.loading" class="position-absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 flex align-items-center justify-content-center">
                        <ProgressSpinner style="width: 30px; height: 30px;" />
                      </div>
                    </div>
                    <div v-else-if="imagen.loading && !imagen.thumbnail" class="w-full h-32 border-round bg-gray-100 flex align-items-center justify-content-center">
                      <ProgressSpinner style="width: 30px; height: 30px;" />
                    </div>
                    <div v-else-if="imagen.error || !imagen.thumbnail" class="w-full h-32 border-round bg-gray-100 flex align-items-center justify-content-center flex-column">
                      <i class="pi pi-image text-3xl text-gray-400 mb-2"></i>
                      <p class="text-xs text-gray-500">{{ imagen.error ? 'Error al cargar' : 'Sin previsualización' }}</p>
                    </div>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-semibold text-color-primary mb-1">
                      {{ imagen.titulo || imagen.nombre }}
                    </p>
                    <p v-if="imagen.descripcion" class="text-xs text-gray-600 mb-2 line-height-3" style="min-height: 2.5rem;">
                      {{ imagen.descripcion }}
                    </p>
                    <p v-if="!imagen.titulo" class="text-xs text-gray-500 mb-1 font-mono">{{ imagen.nombre }}</p>
                    <p class="text-xs text-gray-500 mb-2">{{ imagen.fecha }}</p>
                    <Button 
                      label="Ver imagen" 
                      @click="verImagen(imagen)"
                      class="p-button-text p-button-link text-color-primary p-0"
                      :disabled="imagen.error"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de Videos -->
            <div class="mb-6" v-if="videos.length > 0">
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
                    <p class="text-sm font-semibold text-color-primary mb-1">
                      {{ video.titulo || video.nombre }}
                    </p>
                    <p v-if="video.descripcion" class="text-xs text-gray-600 mb-2 line-height-3" style="min-height: 2.5rem;">
                      {{ video.descripcion }}
                    </p>
                    <p v-if="!video.titulo" class="text-xs text-gray-500 mb-1 font-mono">{{ video.nombre }}</p>
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

            <!-- Loading state -->
            <div v-if="cargandoMultimedia" class="text-center p-6">
              <ProgressSpinner />
              <p class="mt-3 text-gray-500">Cargando archivos multimedia...</p>
            </div>

            <!-- Mensaje cuando no hay contenido -->
            <div v-else-if="imagenes.length === 0 && videos.length === 0" class="text-center p-6">
              <i class="pi pi-images text-3xl text-gray-400 mb-3"></i>
              <p class="text-gray-500">No hay contenido multimedia disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
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
          :disabled="guardandoComentario"
          @click="modalComentarioVisible = false"
          class="back-button"
        />
        <Button 
          label="Guardar Comentario" 
          :loading="guardandoComentario"
          :disabled="!nuevoComentario.trim() || guardandoComentario"
          @click="guardarComentario"
          class="button-primary-custom"
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
            <FileUpload 
              chooseLabel="Seleccionar Archivo" 
              @select="onArchivoSeleccionado"
              mode="basic"
              :accept="tipoMultimedia === 'imagen' ? 'image/*' : 'video/*'"
              customUpload="true"
              class="p-button-outlined p-button-primary"
              ref="fileUploadRef"
            />
            <div v-if="archivoSeleccionado" class="flex align-items-center gap-2 flex-1">
              <span class="text-sm text-gray-600 flex-1">
                {{ archivoSeleccionado.name }}
              </span>
              <Button 
                icon="pi pi-times" 
                @click="eliminarArchivo"
                class="p-button-text p-button-danger p-button-rounded"
                v-tooltip.top="'Eliminar archivo'"
              />
            </div>
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
            <FileUpload 
              v-if="archivoSeleccionado"
              :value="archivoSeleccionado"
              mode="basic"
              controls
              :auto="true"
              :customUpload="true"
              class="max-w-full h-32 border-round border border-gray-200"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="fechaMultimedia" class="block text-900 font-medium mb-2 text-color-primary">Fecha</label>
          <Calendar 
            id="fechaMultimedia"
            v-model="nuevoMultimedia.fecha" 
            :showIcon="true"
            dateFormat="dd/mm/yy"
            :maxDate="fechaMaxima"
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
          :loading="guardandoMultimediaLoading"
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
              :maxDate="fechaMaxima"
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
          :loading="guardandoInforme"
          :disabled="!esInformeValido || guardandoInforme"
          @click="guardarNuevoInforme"
          class="button-primary-custom"
        />
      </template>
    </Dialog>

    <!-- Modal para Ver Imagen Completa -->
    <Dialog 
      v-model:visible="modalImagenVisible" 
      :header="imagenSeleccionada?.titulo || imagenSeleccionada?.nombre || 'Imagen'"
      :style="{ width: '90vw', maxWidth: '1200px' }" 
      :maximizable="true"
      class="p-fluid"
    >
      <div v-if="imagenSeleccionada" class="text-center">
        <div v-if="urlImagenModal" class="mb-3">
          <img 
            :src="urlImagenModal" 
            :alt="imagenSeleccionada.titulo || imagenSeleccionada.nombre"
            class="max-w-full h-auto border-round"
            style="max-height: 80vh;"
            @error="handleImageError"
          />
        </div>
        <div v-else class="p-6">
          <ProgressSpinner />
          <p class="mt-3 text-gray-600">Cargando imagen...</p>
        </div>
        <div class="mt-4 text-left">
          <p v-if="imagenSeleccionada.titulo" class="text-lg font-semibold text-color-primary mb-2">
            {{ imagenSeleccionada.titulo }}
          </p>
          <p v-if="imagenSeleccionada.descripcion" class="text-sm text-gray-700 mb-3 line-height-3">
            {{ imagenSeleccionada.descripcion }}
          </p>
          <div class="border-top-1 border-gray-200 pt-3">
            <p class="text-sm text-gray-600 mb-1"><strong>Nombre del archivo:</strong> {{ imagenSeleccionada.nombre }}</p>
            <p class="text-sm text-gray-600 mb-0"><strong>Fecha:</strong> {{ imagenSeleccionada.fecha }}</p>
            <p class="text-sm text-gray-600 mb-0"><strong>Titulo:</strong> {{ imagenSeleccionada.titulo }}</p>
            <p class="text-sm text-gray-600 mb-0"><strong>Descripcion:</strong> {{ imagenSeleccionada.descripcion }}</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cerrar" 
          @click="modalImagenVisible = false"
          class="back-button"
        />
      </template>
    </Dialog>

    <!-- Modal para Reproducir Video -->
    <Dialog 
      v-model:visible="modalVideoVisible" 
      :header="videoSeleccionado?.titulo || videoSeleccionado?.nombre || 'Video'"
      :style="{ width: '90vw', maxWidth: '1200px' }" 
      :maximizable="true"
      class="p-fluid"
    >
      <div v-if="videoSeleccionado" class="text-center">
        <div v-if="urlVideoModal" class="mb-3">
          <video 
            :src="urlVideoModal" 
            controls
            class="w-full border-round"
            style="max-height: 80vh;"
            @error="handleVideoError"
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
        <div v-else class="p-6">
          <ProgressSpinner />
          <p class="mt-3 text-gray-600">Cargando video...</p>
        </div>
        <div class="mt-4 text-left">
          <p v-if="videoSeleccionado.titulo" class="text-lg font-semibold text-color-primary mb-2">
            {{ videoSeleccionado.titulo }}
          </p>
          <p v-if="videoSeleccionado.descripcion" class="text-sm text-gray-700 mb-3 line-height-3">
            {{ videoSeleccionado.descripcion }}
          </p>
          <div class="border-top-1 border-gray-200 pt-3">
            <p class="text-sm text-gray-600 mb-1"><strong>Nombre del archivo:</strong> {{ videoSeleccionado.nombre }}</p>
            <p class="text-sm text-gray-600 mb-0"><strong>Fecha:</strong> {{ videoSeleccionado.fecha }}</p>
            <p class="text-sm text-gray-600 mb-0"><strong>Titulo:</strong> {{ videoSeleccionado.titulo }}</p>
            <p class="text-sm text-gray-600 mb-0"><strong>Descripcion:</strong> {{ videoSeleccionado.descripcion }}</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cerrar" 
          @click="modalVideoVisible = false"
          class="back-button"
        />
      </template>
    </Dialog>
  </template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showError, showSuccess } from '@/composables/useToast';
import { usePacienteStore } from '../store';
import { useAuthStore } from '@/modules/auth/store';
import { transformarHistoriaFisiatrica } from '@/utils/fhirHelper';
import HistoriaFisiatrica from '../components/HistoriaFisiatrica.vue';

const pacienteStore = usePacienteStore();
const route = useRoute();
const router = useRouter();
const tabActivo = ref('Informes');
const verHistorialActivo = ref(false);
const versionSeleccionada = ref(null);
const cargandoHistorial = ref(false);
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
const fileUploadRef = ref(null);
const informes = ref([]);
const comentarios = ref([]);
const comentarioLoading = ref(false);
const guardandoMultimediaLoading = ref(false);
const guardandoInforme = ref(false);
const guardandoComentario = ref(false);
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

// Datos multimedia
const imagenes = ref([]);
const videos = ref([]);
const cargandoMultimedia = ref(false);
const cargandoPaciente = ref(true);
const imagenSeleccionada = ref(null);
const videoSeleccionado = ref(null);
const modalImagenVisible = ref(false);
const modalVideoVisible = ref(false);
const urlImagenModal = ref('');
const urlVideoModal = ref('');

// Configuración de tabs
const tabs = ref([
  { label: 'Informes', icon: 'pi pi-file-text' },
  { label: 'Historia Fisiátrica', icon: 'pi pi-history' },
  { label: 'Multimedia', icon: 'pi pi-images' }
]);

const fechaMaxima = computed(() => {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() - 1);
  return hoy;
});

const crearHistoriaFisiatrica = computed(() => {
  const h = pacienteStore.historiaFisiatrica;
  return !h || h.fechaEvaluacion === `Sin información`;
});

function getVersionMeta(resource) {
  if (!resource?.extension?.length) {
    return {
      version_number: resource?.id ?? '-',
      effective_from: resource?.effective ?? null,
      is_current: false,
    };
  }
  const ext = (url) => resource.extension.find((e) => e.url?.includes(url));
  return {
    version_number: ext('version-number')?.valueInteger ?? resource?.id ?? '-',
    effective_from: ext('effective-from')?.valueDateTime ?? resource?.effective ?? null,
    is_current: ext('is-current')?.valueBoolean ?? false,
  };
}

function formatearFechaHistorial(value) {
  if (!value) return '-';
  try {
    const d = new Date(value);
    return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return value;
  }
}

const historiaDesdeVersionSeleccionada = computed(() => {
  if (!versionSeleccionada.value) return null;
  return transformarHistoriaFisiatrica(versionSeleccionada.value);
});

function editarHistoria() {
  router.push(`/pacientes/${pacienteStore.paciente.hashId}/nueva-historia?editar=1`);
}

async function abrirHistorial() {
  verHistorialActivo.value = true;
  versionSeleccionada.value = null;
  cargandoHistorial.value = true;
  try {
    await pacienteStore.obtenerHistorialHistoriaFisiatrica(pacienteStore.paciente.hashId);
  } catch (e) {
    showError('No se pudo cargar el historial');
  } finally {
    cargandoHistorial.value = false;
  }
}

function cerrarHistorial() {
  verHistorialActivo.value = false;
  versionSeleccionada.value = null;
  pacienteStore.historialHistoriaFisiatrica = [];
  pacienteStore.versionHistoriaSeleccionada = null;
}

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

    guardandoComentario.value = true;
    try {
      await pacienteStore.crearComentario(comentario, informeSeleccionado.value.hashId);

      comentarios.value = await pacienteStore.obtenerComentarios(informeSeleccionado.value.hashId);
      pacienteStore.paciente = await pacienteStore.obtenerPaciente(pacienteStore.paciente.hashId);
      showSuccess('Comentario agregado correctamente');
      nuevoComentario.value = '';
      modalComentarioVisible.value = false;
    } catch (error) {
      showError('No es posible agregar el comentario');
    } finally {
      guardandoComentario.value = false;
    }
  }
};

// Funciones para multimedia
const agregarImagen = async () => {
  try{
    tipoMultimedia.value = 'imagen';
    limpiarFormularioMultimedia();
    modalMultimediaVisible.value = true;
  }catch(error){
    showError('No es posible agregar la imagen');
  }
};

const agregarVideo = async () => {
  try{
    tipoMultimedia.value = 'video';
    limpiarFormularioMultimedia();
    modalMultimediaVisible.value = true;
  }catch(error){
    showError('No es posible agregar el video');
  }
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
  const archivo = event.files[0];
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

const eliminarArchivo = () => {
  archivoSeleccionado.value = null;
  vistaPrevia.value = null;
  if (fileUploadRef.value) {
    fileUploadRef.value.clear();
  }
};

const guardarMultimedia = async () => {
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
      try{
        guardandoMultimediaLoading.value = true;
        await pacienteStore.agregarImagen(multimedia);
        showSuccess('Imagen agregada correctamente');
        // Recargar la lista de multimedia
        await cargarMultimedia();
        pacienteStore.paciente = await pacienteStore.obtenerPaciente(pacienteStore.paciente.hashId);
      }catch(error){
        showError('No es posible agregar la imagen');
      }finally{
        guardandoMultimediaLoading.value = false;
      }
    } else {
      // Agregar a la lista de videos
      try{
        guardandoMultimediaLoading.value = true;
        await pacienteStore.agregarVideo(multimedia);
        showSuccess('Video agregado correctamente');
        // Recargar la lista de multimedia
        await cargarMultimedia();
        pacienteStore.paciente = await pacienteStore.obtenerPaciente(pacienteStore.paciente.hashId);
      }catch(error){
        showError('No es posible agregar el video');
      }finally{
        guardandoMultimediaLoading.value = false;
      }
    }
    
    modalMultimediaVisible.value = false;
    limpiarFormularioMultimedia();
  }
};

// Función para cargar multimedia desde el servidor
const cargarMultimedia = async () => {
  if (cargandoMultimedia.value) return;
  
  try {
    cargandoMultimedia.value = true;
    const archivos = await pacienteStore.obtenerDocumentos(pacienteStore.paciente.hashId);
    
    imagenes.value = archivos
      .filter(archivo => {
        const tipo = archivo.type?.toLowerCase() || '';
        return tipo.startsWith('image/');
      })
      .map(archivo => {
        // Validar que la URL existe y es válida
        const hasValidUrl = archivo.url && (archivo.url.startsWith('http://') || archivo.url.startsWith('https://'));
        
        return {
          id: archivo.id,
          nombre: archivo.name,
          url: archivo.url || '',
          thumbnail: archivo.url || '', 
          tipo: archivo.type,
          titulo: archivo.titulo || '',
          descripcion: archivo.descripcion || '',
          fechaCreacion: archivo.fechaCreacion,
          fecha: archivo.fechaCreacion ? formatearFecha(archivo.fechaCreacion) : '',
          loading: hasValidUrl, // Solo mostrar loading si hay URL válida
          error: !hasValidUrl // Marcar como error si no hay URL válida
        };
      });
    
    videos.value = archivos
      .filter(archivo => {
        const tipo = archivo.type?.toLowerCase() || '';
        return tipo.startsWith('video/');
      })
      .map(archivo => {
        // Validar que la URL existe y es válida
        const hasValidUrl = archivo.url && (archivo.url.startsWith('http://') || archivo.url.startsWith('https://'));
        
        return {
          id: archivo.id,
          nombre: archivo.name,
          url: archivo.url || '',
          tipo: archivo.type,
          titulo: archivo.titulo || '',
          descripcion: archivo.descripcion || '',
          fechaCreacion: archivo.fechaCreacion,
          fecha: archivo.fechaCreacion ? formatearFecha(archivo.fechaCreacion) : '',
          loading: false,
          error: !hasValidUrl // Marcar como error si no hay URL válida
        };
      });

    
  } catch (error) {
    showError('No se pudieron cargar los archivos multimedia');
  } finally {
    cargandoMultimedia.value = false;
  }
};

const verImagen = async (imagen) => {
  imagenSeleccionada.value = imagen;
  urlImagenModal.value = imagen.url;
  modalImagenVisible.value = true;
};

const verVideo = async (video) => {
  videoSeleccionado.value = video;
  urlVideoModal.value = video.url;
  modalVideoVisible.value = true;
};

// Watcher para cargar multimedia cuando se cambia al tab
watch(tabActivo, (newTab) => {
  if (newTab === 'Multimedia' && pacienteStore.paciente?.hashId) {
    cargarMultimedia();
  }
});

// Manejo de errores de carga de imágenes y videos
const handleImageError = async () => {
  console.error('Error al cargar imagen en modal:', urlImagenModal.value);
  showError('No se pudo cargar la imagen. La URL puede haber expirado. Intenta recargar la página.');
  
  // Intentar recargar los documentos para obtener nuevas URLs firmadas
  try {
    await cargarMultimedia();
    if (imagenSeleccionada.value) {
      // Buscar la imagen actualizada
      const imagenActualizada = imagenes.value.find(img => img.id === imagenSeleccionada.value.id);
      if (imagenActualizada && imagenActualizada.url) {
        urlImagenModal.value = imagenActualizada.url;
        return;
      }
    }
  } catch (error) {
    console.error('Error al recargar multimedia:', error);
  }
  
  urlImagenModal.value = '';
};

const handleVideoError = async () => {
  console.error('Error al cargar video en modal:', urlVideoModal.value);
  showError('No se pudo cargar el video. La URL puede haber expirado. Intenta recargar la página.');
  
  // Intentar recargar los documentos para obtener nuevas URLs firmadas
  try {
    await cargarMultimedia();
    if (videoSeleccionado.value) {
      // Buscar el video actualizado
      const videoActualizado = videos.value.find(vid => vid.id === videoSeleccionado.value.id);
      if (videoActualizado && videoActualizado.url) {
        urlVideoModal.value = videoActualizado.url;
        return;
      }
    }
  } catch (error) {
    console.error('Error al recargar multimedia:', error);
  }
  
  urlVideoModal.value = '';
};

const handlePreviewImageError = async (imagen) => {
  imagen.loading = false;
  imagen.error = true;
  console.error('Error al cargar previsualización de imagen:', imagen.nombre, imagen.url);
  
  // Si la URL parece haber expirado o hay un error de acceso, intentar recargar
  // Las URLs firmadas de S3 expiran después de 10 minutos
  if (imagen.url && !imagen.url.includes('error')) {
    // Marcar que hubo un error pero mantener la URL para que el usuario pueda intentar verla en el modal
    console.warn('Posible URL expirada o error de acceso:', imagen.url);
  }
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
      hashIdEHR: pacienteStore.paciente.hashIdEHR,
    };

    guardandoInforme.value = true;
    try {
      await pacienteStore.crearInforme(informe);

      showSuccess('Informe creado correctamente');
      modalNuevoInformeVisible.value = false;
      limpiarFormularioInforme();

      // Refrescar la lista de informes
      informes.value = await pacienteStore.obtenerInformes(pacienteStore.paciente.hashId);
      pacienteStore.paciente = await pacienteStore.obtenerPaciente(pacienteStore.paciente.hashId);
    } catch (error) {
      showError('No es posible crear el informe');
    } finally {
      guardandoInforme.value = false;
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
  try {
    pacienteStore.paciente = await pacienteStore.obtenerPaciente(route.params.id);
    informes.value = await pacienteStore.obtenerInformes(pacienteStore.paciente.hashId);
    pacienteStore.historiaFisiatrica = await pacienteStore.obtenerHistoriaFisiatrica(pacienteStore.paciente.hashId);

    // Cargar multimedia si el tab activo es Multimedia
    if (tabActivo.value === 'Multimedia') {
      cargarMultimedia();
    }
  } catch (error) {
    showError('No es posible obtener el paciente');
  } finally {
    cargandoPaciente.value = false;
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
