/* =========================================================
   MIRAI — SCRIPT.JS
   ========================================================= */


/* =========================================================
   1. ELEMENTE AUS DEM HTML AUSWÄHLEN
   ========================================================= */

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const revealElements = document.querySelectorAll(".reveal");
const cursorGlow = document.querySelector(".cursor-glow");
const contactForm = document.querySelector("#contactForm");
const yearElement = document.querySelector("#year");

const SUPABASE_URL = "https://abbmyigjnoidpwmxjpbr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bq33n4-pj0bOCaihZnOhNQ_tn3q8m0Y";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: form.name.value,
        email: form.email.value,
        company: form.company.value,
        projekt: form.project.value,
        message: form.message.value
    };

    const { error } = await supabaseClient
        .from("contact_requests")
        .insert([data]);

    if (error) {
        alert("Fehler: " + error.message);
    } else {
        alert("Vielen Dank! Deine Anfrage wurde erfolgreich gesendet.");
        form.reset();
    }
});

/* =========================================================
   2. HEADER BEIM SCROLLEN
   ========================================================= */

function updateHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}


/* Direkt beim Laden prüfen */
updateHeader();


/* Beim Scrollen erneut prüfen */
window.addEventListener(
    "scroll",
    updateHeader,
    {
        passive: true
    }
);


/* =========================================================
   3. MOBILE MENÜ ÖFFNEN UND SCHLIESSEN
   ========================================================= */

function openMobileMenu() {

    if (!menuToggle || !mobileMenu) {
        return;
    }

    mobileMenu.classList.add("open");
    menuToggle.classList.add("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Menü schließen"
    );

    document.body.classList.add("menu-open");

}


function closeMobileMenu() {

    if (!menuToggle || !mobileMenu) {
        return;
    }

    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Menü öffnen"
    );

    document.body.classList.remove("menu-open");

}


function toggleMobileMenu() {

    if (!mobileMenu) {
        return;
    }

    const menuIsOpen =
        mobileMenu.classList.contains("open");

    if (menuIsOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }

}


/* Klick auf Hamburger-Menü */
if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );

}


/* Menü schließen, wenn ein Link angeklickt wird */
mobileLinks.forEach((link) => {

    link.addEventListener(
        "click",
        closeMobileMenu
    );

});


/* =========================================================
   4. MENÜ MIT ESC-TASTE SCHLIESSEN
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            if (
                mobileMenu &&
                mobileMenu.classList.contains("open")
            ) {

                closeMobileMenu();

            }

        }

    }
);


/* =========================================================
   5. MOBILE MENÜ BEI DESKTOP-GRÖSSE SCHLIESSEN
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 850) {
            closeMobileMenu();
        }

    }
);


/* =========================================================
   6. SCROLL-REVEAL-ANIMATIONEN
   ========================================================= */

/*
   Im CSS haben die Elemente zuerst:

   .reveal {
       opacity: 0;
       transform: translateY(28px);
   }

   Sobald sie sichtbar werden,
   fügt JavaScript die Klasse .visible hinzu.
*/


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        /*
                           Nach der ersten Animation
                           muss das Element nicht weiter
                           beobachtet werden.
                        */

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }

        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    /*
       Fallback für sehr alte Browser:
       Alle Elemente direkt sichtbar machen.
    */

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================================
   7. AKTUELLES JAHR IM FOOTER
   ========================================================= */

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   8. CURSOR GLOW EFFEKT
   ========================================================= */

/*
   Der Effekt wird nur auf Geräten aktiviert,
   die eine Maus oder einen präzisen Pointer haben.

   Auf Smartphones wird der Effekt nicht benötigt.
*/

const hasFinePointer =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;


if (
    cursorGlow &&
    hasFinePointer
) {

    window.addEventListener(

        "pointermove",

        (event) => {

            cursorGlow.style.left =
                `${event.clientX}px`;

            cursorGlow.style.top =
                `${event.clientY}px`;

        },

        {
            passive: true
        }

    );

}


/* =========================================================
   9. SMOOTH SCROLL FÜR ANKER-LINKS
   ========================================================= */

const anchorLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


anchorLinks.forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute("href");


            /*
               Links mit nur "#" ignorieren.
            */

            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const targetElement =
                document.querySelector(
                    targetId
                );


            if (!targetElement) {
                return;
            }


            event.preventDefault();


            /*
               Höhe des Headers berücksichtigen.
            */

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetPosition =
                targetElement
                    .getBoundingClientRect()
                    .top
                +
                window.scrollY
                -
                headerHeight
                -
                15;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        }
    );

});


/* =========================================================
   10. AKTIVEN NAVIGATIONSLINK BEIM SCROLLEN ERKENNEN
   ========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        '.desktop-nav a[href^="#"]'
    );


function updateActiveNavigation() {

    let currentSection = "";


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;


        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach((link) => {

        link.classList.remove("active");


        const href =
            link.getAttribute("href");


        if (
            href ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(

    "scroll",

    updateActiveNavigation,

    {
        passive: true
    }

);


updateActiveNavigation();





/* =========================================================
   12. FORMULAR-STATUS BEIM NEUEN EINGEBEN ENTFERNEN
   ========================================================= */

if (contactForm) {

    const formFields =
        contactForm.querySelectorAll(
            "input, textarea, select"
        );


    formFields.forEach((field) => {

        field.addEventListener(
            "input",
            () => {

                const formStatus =
                    contactForm.querySelector(
                        ".form-status"
                    );


                if (formStatus) {

                    formStatus.textContent = "";

                }

            }
        );

    });

}


/* =========================================================
   13. BUTTON RIPPLE / CLICK FEEDBACK
   ========================================================= */

const buttons =
    document.querySelectorAll(
        ".button"
    );


buttons.forEach((button) => {

    button.addEventListener(
        "pointerdown",
        () => {

            button.classList.add(
                "is-clicked"
            );


            setTimeout(() => {

                button.classList.remove(
                    "is-clicked"
                );

            }, 180);

        }
    );

});


/* =========================================================
   14. SEITE NACH DEM LADEN BEREIT MARKIEREN
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);