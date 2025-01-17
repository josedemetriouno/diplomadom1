
document.addEventListener('DOMContentLoaded', () => {
    const idiomaGuardado = localStorage.getItem('idiomaSeleccionado') || 'es'; 
    cargarMenu().then(() => traducirMenu(idiomaGuardado)); 
});

async function cargarMenu() {
    try {
        const respuestaXML = await fetch('menu.xml');
        if (!respuestaXML.ok) throw new Error('Error al cargar menu.xml');
        const textoXML = await respuestaXML.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textoXML, 'application/xml');

        const respuestaJSON = await fetch('submenus.json');
        if (!respuestaJSON.ok) throw new Error('Error al cargar submenus.json');
        const datosSubmenus = await respuestaJSON.json();

        const menuContenedor = document.getElementById('menu');
        menuContenedor.innerHTML = ''; 

        xmlDoc.querySelectorAll('opcion').forEach((opcion) => {
            const nombreOpcionEs = opcion.querySelector('nombre').getAttribute('es');
            const nombreOpcionEn = opcion.querySelector('nombre').getAttribute('en');

            const li = document.createElement('li');
            li.classList.add('nav-item', 'dropdown');

            const enlace = document.createElement('a');
            enlace.classList.add('nav-link', 'dropdown-toggle');
            enlace.textContent = nombreOpcionEs; 
            enlace.href = '#';
            enlace.setAttribute('data-bs-toggle', 'dropdown');
            enlace.setAttribute('aria-expanded', 'false');
            enlace.dataset.es = nombreOpcionEs;
            enlace.dataset.en = nombreOpcionEn;

            li.appendChild(enlace);

            if (datosSubmenus[nombreOpcionEs] && datosSubmenus[nombreOpcionEs].length > 0) {
                const ulSubmenu = document.createElement('ul');
                ulSubmenu.classList.add('dropdown-menu');

                datosSubmenus[nombreOpcionEs].forEach((submenu) => {
                    const liSubmenu = document.createElement('li');
                    const enlaceSubmenu = document.createElement('a');
                    enlaceSubmenu.classList.add('dropdown-item');
                    enlaceSubmenu.textContent = submenu.nombre;
                    enlaceSubmenu.href = submenu.enlace;
                    enlaceSubmenu.dataset.es = submenu.nombre;
                    enlaceSubmenu.dataset.en = submenu.nombre_en;

                    liSubmenu.appendChild(enlaceSubmenu);
                    ulSubmenu.appendChild(liSubmenu);
                });

                li.appendChild(ulSubmenu);
            }

            menuContenedor.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}


async function traducirMenu(idioma) {
    try {
        
        const menuItems = document.querySelectorAll('#menu > li > a');
        menuItems.forEach((item) => {
            if (item.dataset[idioma]) {
                item.textContent = item.dataset[idioma];
            } else {
                console.warn(`No se encontró traducción para: ${item.textContent}`);
            }
        });

        
        const subMenuItems = document.querySelectorAll('#menu .dropdown-menu .dropdown-item');
        subMenuItems.forEach((item) => {
            if (item.dataset[idioma]) {
                item.textContent = item.dataset[idioma];
            } else {
                console.warn(`No se encontró traducción para submenú: ${item.textContent}`);
            }
        });

        
        const elementosTraducibles = document.querySelectorAll('[data-es], [data-en]');
        elementosTraducibles.forEach((elemento) => {
            if (elemento.dataset[idioma]) {
                elemento.textContent = elemento.dataset[idioma];
            }
        });
    } catch (error) {
        console.error('Error al traducir el menú:', error);
    }
}


document.getElementById('btn-espanol').addEventListener('click', () => {
    localStorage.setItem('idiomaSeleccionado', 'es'); 
    traducirMenu('es');
});

document.getElementById('btn-ingles').addEventListener('click', () => {
    localStorage.setItem('idiomaSeleccionado', 'en'); 
    traducirMenu('en');
});
