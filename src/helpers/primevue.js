// Componentes de formulario
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Select from 'primevue/select';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';

// Componentes de presentación
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Toast from 'primevue/toast';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';

// Componentes de navegación
import Tabs from 'primevue/tabs';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Timeline from 'primevue/timeline';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default {
  install(app) {
    app.component('InputText', InputText);
    app.component('Textarea', Textarea);
    app.component('Dropdown', Dropdown);
    app.component('InputNumber', InputNumber);
    app.component('Select', Select);
    app.component('Calendar', Calendar);
    app.component('Button', Button);
    app.component('Card', Card);
    app.component('Avatar', Avatar);
    app.component('Toast', Toast);
    app.component('Message', Message);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('Dialog', Dialog);
    app.component('Tabs', Tabs);
    app.component('TabPanels', TabPanels);
    app.component('TabPanel', TabPanel);
    app.component('TabList', TabList);
    app.component('Tab', Tab);
    app.component('Timeline', Timeline);
    app.component('Divider', Divider);
  },
};
